package org.broadinstitute.orsp.api

import com.google.gson.JsonArray
import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.CollectionLinkStatus
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.ConsentService
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.DataUseRestriction
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueExtraProperty
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.PersistenceService
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.utils.IssueUtils
import org.broadinstitute.orsp.utils.UtilityClass
import org.springframework.web.multipart.MultipartFile

import javax.ws.rs.core.Response

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class NewConsentGroupController extends AuthenticatedController {

    ConsentService consentService
    PersistenceService persistenceService

    def show() {
        render(view: "/newConsentGroup/index", model: [projectKey: params.projectKey])
    }

    def downloadFillablePDF () {
        try {
            String fileName = 'Broad_DUL_Draft-Cover_Letter_Form_Fillable.pdf'
            def resource = this.class.classLoader.getResource(fileName)
            response.setHeader('Content-disposition', "attachment; ${fileName}")
            response.setHeader('Content-Length', 'file-size')
            response.setContentType('application/pdf')
            response.outputStream << resource.openStream()
        } catch (Exception e) {
           handleException(e)
        }
    }

    def save() {
        Issue consent
        ConsentCollectionLink consentCollectionLink
        try{
            List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
            User user = getUser()
            JsonParser parser = new JsonParser()
            JsonArray dataProjectJson = parser.parse(request.parameterMap["dataProject"].toString())
            JsonArray dataConsentCollectionJson = parser.parse(request.parameterMap["dataConsentCollection"].toString())
            Issue issue = IssueUtils.getJson(Issue.class, dataProjectJson[0])
            consentCollectionLink = IssueUtils.getJson(ConsentCollectionLink.class, dataConsentCollectionJson[0])
            Issue source = queryService.findByKey(issue.getSource())
            if (source != null) {
                issue.setRequestDate(new Date())
                consent = issueService.createIssue(IssueType.CONSENT_GROUP, issue)
                consentCollectionLink.consentKey = consent.projectKey
                consentCollectionLink.creationDate = new Date()
                persistenceService.saveEvent(issue.projectKey, user?.displayName, "New Consent Group Added", EventType.SUBMIT_CONSENT_GROUP)
                try {
                    persistenceService.saveConsentCollectionLink(consentCollectionLink)
                } catch (Exception e) {
                    flash.error = e.getMessage()
                }
                if (!files?.isEmpty()) {
                    files.forEach {
                        storageProviderService.saveMultipartFile(user.displayName, user.userName, consent?.projectKey, it.name, it, consentCollectionLink)
                    }
                }
                notifyService.consentGroupCreation(issue, consentCollectionLink)
                consent.status = 201
                render([message: consent] as JSON)
            } else {
                Response response = response.status(400)
                response.entity("Invalid project key")
                render([message: response] as JSON)
            }
        } catch (Exception e) {
            if (consent != null) {
                issueService.deleteIssue(consent.projectKey)
            }
            if (consentCollectionLink != null) {
                persistenceService.deleteCollectionLink(consentCollectionLink)
            }
            log.error("There was an error trying to create consent group: " + e.message)
            handleException(e)
        }

    }

    def approveConsentGroup() {
        Object input = IssueUtils.getJson(Object.class, request.JSON)
        String projectKey = params.id
        Issue issue = queryService.findByKey(projectKey)
        Map<String, Object> simpleInput = new HashMap<>()
        simpleInput.put(IssueExtraProperty.PROJECT_REVIEW_APPROVED, true)
        try {
            issueService.modifyExtraProperties(simpleInput, projectKey)
            render([message: issue])
        } catch(Exception e) {
            handleException(e)
        }
    }

    def delete() {
        Issue issue = queryService.findByKey(params.consentKey)
        if(issue != null) {
            issueService.deleteIssue(params.consentKey)
            persistenceService.saveEvent(issue.projectKey, getUser()?.displayName, "Consent Group Rejected", EventType.REJECT_CONSENT_GROUP)
            response.status = 200
            render([message: 'Consent Group was deleted'] as JSON)
        } else {
            handleNotFound('Consent Group not found')
        }
    }

    def update() {
        Map<String, Object> consent = IssueUtils.getJson(Map.class, request.JSON)
        Issue issue = Issue.findByProjectKey(params.consentKey)
        issueService.updateIssue(issue, consent)
        response.status = 200
        render([message: 'Consent Group was updated'] as JSON)
    }

    def deleteNoConsentReason() {
        Issue issue = Issue.findByProjectKey(params.consentKey)
        issueService.removeNoConsentAnswer(issue)
        response.status = 200
        render([message: 'Deleted No Consent Form reason'] as JSON)
    }

    def findByUUID() {
        String uid = params.uuid
        DataUseLetter dul = DataUseLetter.findByUid(uid)
        Map<String, String> consent = new HashMap<>()
        if(dul != null) {
            User user = userService.findUser(dul.getCreator())
            Issue issue = queryService.findByKey(dul.getConsentGroupKey())
            consent.put("dataManagerName", user.getDisplayName())
            consent.put("dataManagerEmail", user.getEmailAddress())
            consent.put("consentGroupKey", issue.getProjectKey())
            consent.put(IssueExtraProperty.SUMMARY, issue.getSummary())
            consent.put(IssueExtraProperty.PROTOCOL, IssueExtraProperty.findByProjectKeyAndName(dul.getConsentGroupKey(), IssueExtraProperty.PROTOCOL).getValue())
        }
        response.status = 200
        render([consent: consent] as JSON)
    }

    def getDataUseRestriction() {
        DataUseRestriction restriction = DataUseRestriction.findByConsentGroupKey(params.consentKey)
        Collection<String> duSummary = consentService.getSummary(restriction)
        render([restriction: duSummary, restrictionId: restriction?.id] as JSON)
    }

    def getExportedConsentGroup() {
        DataUseRestriction restriction = DataUseRestriction.findByConsentGroupKey(params.consentKey)
        render([vaultConsentId: restriction?.vaultConsentId, vaultConsentLocation: restriction?.vaultConsentLocation, vaultExportDate: restriction?.vaultExportDate] as JSON)
    }

    Collection<ConsentCollectionLink> getConsentCollectionLinks() {
        Issue issue = queryService.findByKey(params.consentKey)
        if (issue != null) {
            Collection<ConsentCollectionLink> collectionLinks = queryService.findCollectionLinksByConsentKey(issue.projectKey)
            render([collectionLinks: collectionLinks.linkedProject] as JSON)
            collectionLinks
        } else {
            handleNotFound('Consent Group not found')
        }
    }

    def getProjectConsentGroups() {
        Issue issue = queryService.findByKey(params.projectKey)
        if (issue != null) {
            UtilityClass.registerIssueMarshaller()
            try {
                LinkedHashMap consentGroups = consentService.findProjectConsentGroups(params.projectKey)
                consentGroups.each {consentKeys, consentValues ->
                    if(consentKeys == "consentGroups"){
                        for (Object consentObject : consentValues) {
                            LinkedHashMap consentGroup = queryService.getConsentGroupByKey(consentObject.getAt("projectKey"))
                                consentGroup.each {groupkey, groupValue ->
                                    if(groupkey == "extraProperties"){
                                        for (Object groupObject : groupValue) {
                                            String countrySource = groupObject.getAt("institutionalSources")
                                            if(countrySource != null && countrySource != "[]" ){
                                                def parser = new JsonSlurper()
                                                def jsonData = parser.parseText(countrySource)
                                                String country = "";
                                                jsonData.each {
                                                    country+= it.country+","
                                                }
                                                country = country.substring(0, country.length() - 1)
                                                consentObject.putAt("summary",consentObject.getAt("summary")+' / '+groupObject.getAt("collInst")+' / '+country)
                                            }else{
                                                consentObject.putAt("summary",consentObject.getAt("summary")+' / '+groupObject.getAt("collInst"))
                                            }
                                        }
                                    }
                                }
                        }
                    }
                }   
                response.status = 200
                JSON.use(UtilityClass.ISSUE_RENDERER_CONFIG) {
                    render( consentGroups as JSON)
                }
            } catch(IllegalArgumentException e) {
                handleIllegalArgumentException(e)
            } catch(Exception e) {
                handleException(e)
            }
        } else {
            handleNotFound('Project not found')
        }

    }

    /**
     * This action breaks the link between a project and the consent from the point of view of the consent.
     *
     */
    def unlinkAssociatedProjects () {
        Issue consent = queryService.findByKey(params.consentKey)
        Issue target = queryService.findByKey(request.JSON["projectKey"] as String)
        Collection<ConsentCollectionLink> links = ConsentCollectionLink.findAllByProjectKeyAndConsentKey(target.projectKey, consent.projectKey)
        try {
            persistenceService.deleteCollectionLinks(links)
            response.status = 200
        } catch (Exception e) {
            handleException(e)
        }
        render(response)
    }

    def unlinkAssociatedSampleCollection () {
        String consentCollectionId = request.JSON["consentCollectionId"]
        try {
            ConsentCollectionLink collectionLink = queryService.findCollectionLinkById(consentCollectionId).first()
            persistenceService.deleteCollectionLink(collectionLink)
            response.status = 200
        } catch(Exception e) {
            handleException(e)
        }
        render(response)
    }


    /**
     * This action approve the link between a project and the consent.
     *
     */
    def approveLink () {
        try {
            boolean isUpdated = queryService.updateCollectionLinkStatus(params.consentKey, params.projectKey, CollectionLinkStatus.APPROVED.name)
            List<ConsentCollectionLink> links = queryService.findConsentCollectionLinksByProjectKeyAndConsentKey(params.projectKey, params.consentKey)
            notifyService.sendApproveRejectLinkNotification(params.projectKey.toString(), params.consentKey.toString(), true, getUser()?.displayName)
            if (!isUpdated) {
              response.status = 400
              render([message: 'Error updating collection links, please check specified parameters.'] as JSON)
            } else {
              response.status = 200
              render(links as JSON)
            }
        } catch (Exception e) {
            handleException(e)
        }
        render(response)
    }

    def matchConsentName() {
        try {
            render(params.consentName ? queryService.matchingIssueNamesCount(params.consentName) > 0 : false)
        } catch(Exception error) {
            handleException(error)
        }
    }

    def hardDelete() {
        Boolean isAdmin = isAdmin()
        if (!isAdmin) {
            handleForbidden()
        }
        Issue issue = queryService.findByKey(params.consentKey)
        if(issue != null) {
            issueService.hardDeleteIssue(params.consentKey)
            response.status = 200
            render([message: 'Consent Group was deleted'] as JSON)
        } else {
            handleNotFound('Consent Group not found')
        }

    }
}
