package org.broadinstitute.orsp

import grails.converters.JSON
import org.broadinstitute.orsp.utils.IssueUtils
import org.springframework.web.multipart.MultipartFile

/**
 * Handle all functions related to Consent Groups
 */
class ConsentGroupController extends AuthenticatedController {

    public static final String DU_LETTER = "Data Use Letter"

    ConsentService consentService

    String getType() {
        IssueType.CONSENT_GROUP.controller
    }

    def create() {
        [consentGroupNames: getExistingConsentGroupNames()]
    }

    def handleIntake(String key) {
        // no-op
    }

    /**
     * Link a project to a new consent group using the optionally selected sample collections
     * Method requires these parameters:
     *
     *   params.source              The project key
     *   params.consentGroupKey     The consent group key
     *   params.newSamples          Optional list of new (un-consented) sample collection ids to link to the consent
     *                                  group and the project
     */
    def createAndLink() {
        Issue source = queryService.findByKey(params.source)
        Issue consent = new Issue(
                type: IssueType.CONSENT_GROUP.name,
                status: IssueStatus.Open.name,
                summary: params.summary,
                reporter: getUser()?.userName,
                requestDate: new Date()
        )
        consent = issueService.addIssue(consent, params)
        try {
            // If any sample collections were linked, we need to add them to the consent group.
            def sampleCollectionIds = []
            if (params.newSamples) { sampleCollectionIds.addAll(params.newSamples) }
            if (sampleCollectionIds.isEmpty()) {
                new ConsentCollectionLink(
                        projectKey: source.projectKey,
                        consentKey: consent.projectKey,
                        sampleCollectionId: null,
                        creationDate: new Date()
                ).save(flush: true)
            } else {
                sampleCollectionIds.each {
                    new ConsentCollectionLink(
                            projectKey: source.projectKey,
                            consentKey: consent.projectKey,
                            sampleCollectionId: it,
                            creationDate: new Date()
                    ).save(flush: true)
                }
            }
        } catch (Exception e) {
            flash.error = e.getMessage()
        }
        redirect([controller: source.controller, action: "show", params: [id: source.projectKey, tab: "consent-groups"]])
    }

    /**
     // TODO: Move db logic to service
     * Link a project to an existing consent group using the optionally selected sample collections
     * Method requires these parameters:
     *
     *   params.source              The project key
     *   params.consentGroupKey     The consent group key
     *   params.selectedSamples     Optional list of sample collection ids in the consent group to link to project
     */
    def link() {
        Issue source = queryService.findByKey(params.source)
        Issue consent = queryService.findByKey(params.consentGroupKey)
        List<Exception> errors = []
        def sampleCollectionIds = []
        if (params.selectedSamples) { sampleCollectionIds.addAll(params.selectedSamples) }
        if (sampleCollectionIds.isEmpty()) {
            try {
                new ConsentCollectionLink(
                        projectKey: source.projectKey,
                        consentKey: consent.projectKey,
                        sampleCollectionId: null,
                        creationDate: new Date()
                ).save(flush: true)
            } catch (Exception e) {
                errors.add(e)
            }
        } else {
            sampleCollectionIds.each {
                try {
                    new ConsentCollectionLink(
                            projectKey: source.projectKey,
                            consentKey: consent.projectKey,
                            sampleCollectionId: it,
                            creationDate: new Date()
                    ).save(flush: true)
                } catch (Exception e) {
                    errors.add(e)
                }
            }
        }
        if (errors) {
            flash.error = errors*.message.join(", ")
        }
        redirect(controller: source.controller, action: "show", params: [id: source.projectKey, tab: "consent-groups"])
    }

    /**
     * This action breaks the link between a project and a consent from the point of view of the project. Redirects
     * back to the project
     *
     * TODO: Very similar logic here to unLink. Look into merging links to these services with required controller argument
     *
     * @return Redirect to the project view page
     */
    def breakLink() {
        def issue = queryService.findByKey(params.projectKey)
        def links = ConsentCollectionLink.findAllByProjectKeyAndConsentKey(params.projectKey, params.consentKey)
        deleteCollectionLinks(links)
        redirect(controller: "project", action: "main", params: [projectKey: params.projectKey, tab: "consent-groups"])
    }

    /**
     * This action breaks the link between a project and the consent from the point of view of the consent. Redirects
     * back to the consent page.
     *
     * @return Redirect to the consent view page
     */
    def unLink() {
        Issue issue = queryService.findByKey(params.id)
        Issue target = queryService.findByKey(params.target)
        def links = ConsentCollectionLink.findAllByProjectKeyAndConsentKey(target.projectKey, issue.projectKey)
        deleteCollectionLinks(links)
        redirect(controller: 'consentGroup', action: "show", params: [id: issue.projectKey, tab: 'documents'])
    }

    /**
     * This action removes a single association between sample collection, project, and consent group
     *
     * @return Redirect to the consent view page
     */
    def unLinkConsentCollection() {
        def link = ConsentCollectionLink.findById(params.id)
        deleteCollectionLinks(Collections.singletonList(link))
        redirect(controller: 'newConsentGroup', action: "main", model: [consentKey: params.consentKey, tab: 'details'])
    }

    /**
     * TODO: Add in event logging for this
     *
     * @param links The collection of links to remove.
     */
    private deleteCollectionLinks(Collection<ConsentCollectionLink> links) {
        try {
            persistenceService.deleteCollectionLinks(links)
        } catch (Exception e) {
            log.error("Exception deleting collection links: " + e)
            flash.error = "Error deleting collection links: " + e
        }
    }

    def edit() {
        Issue issue = queryService.findByKey(params.id)
        def collectionLinks = queryService.findCollectionLinksByConsentKey(issue.projectKey)
        [issue: issue,
         collectionLinks: collectionLinks,
         consentGroupNames: getExistingConsentGroupNames() - issue.summary,
         tab: 'details']
    }

    @Override
    show() {
        Issue issue = queryService.findByKey(params.id)
        if (issueIsForbidden(issue)) {
            redirect(controller: 'Index', action: 'index')
        }
        def attachments = issue.attachments?.sort {a,b -> b.createDate <=> a.createDate}
        def restriction = DataUseRestriction.findByConsentGroupKey(issue.projectKey)
        Collection<String> duSummary = consentService.getSummary(restriction)
        def collectionLinks = queryService.findCollectionLinksByConsentKey(issue.projectKey)
//        def checklistAnswers = ChecklistAnswer.findAllByProjectKey(issue.projectKey)
        [issue: issue,
         collectionLinks: collectionLinks,
         attachments: attachments,
         attachmentTypes: PROJECT_DOC_TYPES,
         restriction: restriction,
         duSummary: duSummary,
         tab: params.tab,
         duLetter: DU_LETTER,
         attachmentsApproved: issue.attachmentsApproved(),
         projectReviewApproved: issue.getProjectReviewApproved()
//         checklistAnswers: checklistAnswers
        ]
    }

    def projectConsentGroups() {
        Issue issue = queryService.findByKey(params.id)
        Collection<ConsentCollectionLink> collectionLinks = ConsentCollectionLink.findAllByProjectKey(issue.projectKey)
        Map<String, ConsentCollectionLink> collectionLinksMap = collectionLinks.collectEntries{[it.consentKey, it]}
        Collection<Issue> consentGroups = queryService.findByKeys(collectionLinksMap)
        render(
                view: "/consentGroup/list",
                model: [
                        issue: issue,
                        consentGroups: consentGroups?.sort {a, b -> a.summary?.toLowerCase() <=> b.summary?.toLowerCase()},
                        attachmentTypes: PROJECT_DOC_TYPES,
                        controller: IssueType.CONSENT_GROUP.controller
                ]
        )
    }

    /**
     * TODO: Move to transaction
     */
//    def updateChecklist() {
//        def issue = queryService.findByKey(params.id)
//        Collection<ChecklistAnswer> checklistAnswers = ChecklistAnswer.findAllByProjectKey(issue.projectKey)
//        // Need to keep this list of ids in sync with the question IDs in the UI.
//        def questionIds = ["q1", "q1_comment", "q2", "q2_comment", "q3", "q3_comment",
//                           "q4A", "q4A_comment", "q4B", "q4B_comment", "q5", "q5_comment",
//                           "q6A", "q6A_comment", "q6B", "q6B_comment", "q6C", "q6C_comment",
//                           "q7_comment"]
//        try {
//            questionIds.each {
//                questionId ->
//                    if (params.get(questionId)) {
//                        saveOrUpdateAnswer(questionId, (String) params.get(questionId), checklistAnswers, issue.projectKey)
//                    }
//            }
//        } catch (Exception e) {
//            flash.error = e.message
//        }
//        redirect(controller: 'consentGroup', action: "show", params: [id: params.get("id"), tab: 'checklist'])
//    }

//    private void saveOrUpdateAnswer(String questionId, String answerValue, Collection<ChecklistAnswer> checklistAnswers, String issueKey) {
//        // look for answer in current checklist:
//        def answer = checklistAnswers?.find { it.questionId?.equals(questionId) }
//        Date now = new Date()
//        if (answer) {
//            answer.setValue(answerValue)
//            answer.setUpdateDate(now)
//            answer.setReviewer(getUser()?.displayName)
//            answer.save()
//        } else {
//            new ChecklistAnswer(
//                    questionId: questionId,
//                    projectKey: issueKey,
//                    value: answerValue,
//                    updateDate: now,
//                    reviewer: getUser()?.displayName
//            ).save(failOnError: true)
//        }
//    }

    def attachDocument() {
        def issue = queryService.findByKey(params.id)
        try {
            if (request.multiFileMap?.files) {
                storageProviderService.saveMultipartFiles(
                        (String) getUser()?.displayName,
                        (String) getUser()?.userName,
                        (String) issue.projectKey,
                        (String) params.type,
                        (Collection<MultipartFile>) request.multiFileMap.files)
            }
            redirect(action: "show", params: [id: issue.projectKey, tab: "documents"])
        } catch (Exception e) {
            render([status: 500, text: [error: e.message] as JSON])
        }
    }

    /**
     * TODO: Move to transaction
     */
    def saveRestriction() {
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        restriction.save(params)
        redirect(controller: 'newConsentGroup', action: "main", model: [consentKey: restriction.consentGroupKey, tab: 'documents'])
    }

    /**
     * Get a list of existing consent group names. Need to remove this one from the list for editing purposes.
     *
     * @param thisName The name (or summary field ) of this consent group
     * @return List of existing consent group names, minus this name.
     */
    private List<String> getExistingConsentGroupNames() {
        queryService.getConsentGroupSummaries()
    }

    def getConsentGroups() {
        def data = []
        queryService.findByQueryOptions(
                new QueryOptions(issueTypeNames: [IssueType.CONSENT_GROUP.name])
        ) each {
            data << [
                    id: it.projectKey,
                    label: it.projectKey + " ( " + it.summary + " )"
            ]
        }
        render data as JSON
    }

    def getConsentGroup(){
        String projectKey = params.id
        LinkedHashMap consentGroup = queryService.getConsentGroupByKey(projectKey)
        render(consentGroup as JSON)
    }

    def unConsentedSampleCollections() {
        render queryService.getUnConsentedSamples() as JSON
    }

    def consentGroupSummaries() {
        render queryService.getConsentGroupSummaries() as JSON
    }

    def getConsentGroupSampleCollections() {
        List<String> sampleCollectionIds = queryService.findAllSampleCollectionIdsForConsent(params.consentKey)
        Collection<SampleCollection> sampleCollections
        if (!sampleCollectionIds.isEmpty()) {
            sampleCollections = SampleCollection.findAllByCollectionIdInList(sampleCollectionIds)
        } else {
            sampleCollections = Collections.emptyList()
        }
        render sampleCollections as JSON
    }

    def loadModalWindow() {
        def issue = queryService.findByKey(params.issueKey)
        def consent = queryService.findByKey(params.consentKey)
        render(template: "attachConsentDocument",
                model:
                        [issue: issue,
                         consent: consent,
                         attachmentTypes: PROJECT_DOC_TYPES])
    }

    def attachConsentDocument() {
        def issue = queryService.findByKey(params.issueKey)
        try {
            if (request.multiFileMap?.files) {
                storageProviderService.saveMultipartFiles(
                        (String) getUser()?.displayName,
                        (String) getUser()?.userName,
                        (String) params.consentKey,
                        (String) params.type,
                        (Collection<MultipartFile>) request.multiFileMap.files)
            }
        } catch (Exception e) {
            flash.error = "Unable to attach consent document: " + e.getMessage()
        }
        Map<String, Object> arguments = IssueUtils.generateArgumentsForRedirect(issue, params.issueKey, "consent-groups")
        redirect([action: arguments.get("action"), controller: arguments.get("controller"), params: arguments.get("params")])
    }

    def loadConfirmationDialog() {
        def issue = queryService.findByKey(params.issueKey)
        def consent = queryService.findByKey(params.consentKey)
        render(template: "confirmationDialog",
                model:
                        [issue: issue,
                         consent: consent])
    }

    def loadRequestClarification() {
        def issue = queryService.findByKey(params.issueKey)
        def consent = queryService.findByKey(params.consentKey)
        render(template: "requestClarification",
                model:
                        [issue: issue,
                         consent: consent])
    }
}
