package org.broadinstitute.orsp

import com.google.gson.Gson
import com.google.gson.JsonArray
import com.google.gson.JsonParser
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.IssueUtils
import org.springframework.web.multipart.MultipartFile

@Slf4j
class SubmissionController extends AuthenticatedController {

    def renderMainComponent() {
        render(view: "/mainContainer/index", model: [params.projectKey, params.type, params.submissionId])
    }

    def getSubmissions() {
        Issue issue = queryService.findByKey(params.id)
        if (issueIsForbidden(issue)) {
            response.status = 403
            render([error: "Issue is forbidden."] as JSON)
        }
        Collection<Submission> submissions = queryService.getSubmissionsByProject(issue.projectKey)
        Map<String, List<Submission>> groupedSubmissions = groupSubmissions(issue, submissions)
        render([groupedSubmissions: groupedSubmissions] as JSON)
    }

    private static Collection<String> getSubmissionTypesForIssueType(String issueType) {
        IssueUtils.isIrb(issueType) ?
                SubmissionType.getIRBTypes()*.label :
                SubmissionType.getNonIRBTypes()*.label
    }

    def index() {
        Issue issue = queryService.findByKey(params.projectKey)
        Collection<Submission> submissions = queryService.getSubmissionsByProject(issue.projectKey)
        Collection<String> submissionTypes = getSubmissionTypesForIssueType(issue.getType())
        Submission submission = params?.submissionId ? Submission.findById(params?.submissionId) : null
        Map<String, Integer> submissionNumberMaximums = new HashMap<>()
        submissions.each {
            if (submissionNumberMaximums.containsKey(it.type)) {
                if (it.number > submissionNumberMaximums.get(it.type)) {
                    submissionNumberMaximums.put(it.type, it.number)
                }
            } else {
                submissionNumberMaximums.put(it.type, it.number)
            }
        }
        SubmissionType defaultType = SubmissionType.getForLabel(params.get("type").toString()) ?: SubmissionType.Amendment.label
        render( [issue:                      issue,
                 typeLabel:                  issue.typeLabel,
                 submission:                 submission,
                 documents:                  submission?.documents,
                 docTypes:                   PROJECT_DOC_TYPES,
                 submissionTypes:            submissionTypes,
                 submissionNumberMaximums:   submissionNumberMaximums,
                 defaultType:                defaultType
        ] as JSON)
    }

    def save() {
        JsonParser parser = new JsonParser()
        JsonArray dataSubmission = parser.parse(request.parameterMap["submission"].toString())
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
        User user = getUser()

        try {
            Submission submission
            if (params?.submissionId) {
                submission = Submission.findById(params?.submissionId)
                submission.comments = dataSubmission[0].comments.value
                submission.type = dataSubmission[0].type.value
            } else {
                submission = getJson(Submission.class, dataSubmission[0])
                submission.createDate = new Date()
                submission.author = getUser()?.displayName
                submission.documents = new ArrayList<StorageDocument>()
            }
            if(!files?.isEmpty()) {
                files.forEach {
                    StorageDocument document = storageProviderService.saveMultipartFile(
                            user.displayName,
                            user.userName,
                            submission.projectKey,
                            it.part.fileItem.fieldName,
                            it,
                            null)
                    submission.documents.add(document)
                }
            }

            if (!submission.save(flush: true)) {
                response.status = 500
                render([error: submission.errors.allErrors] as JSON)
            }

            response.status = 201
            render([message: submission] as JSON)

        } catch (Exception e) {
            log.error("There was an error trying to save the submission: " + e.message)
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def delete() {
        def submission = Submission.findById(params.submissionId)
        if (submission) {
            def message = "Removed Submission: " + submission.abbreviatedComment
            persistenceService.saveEvent(submission.projectKey, getUser()?.displayName, message, null)
            Collection<Long> docIds = submission.documents*.id
            // TODO: Move this to a transactional service.
            submission.delete(flush: true)
            docIds.each {
                StorageDocument doc = StorageDocument.findById(it)
                storageProviderService.removeStorageDocument(doc, getUser()?.displayName)
            }
        }
        if (submission.hasErrors()) {
            response.status = 500
            render([error: submission.getErrors() ] as JSON)
        } else {
            response.status = 200
            render([message: 'Submission was deleted'] as JSON)
        }
    }

    def removeFile() {
        def submission = Submission.findById(params?.submissionId)
        def document = StorageDocument.findByUuid(params?.uuid)
        submission?.getDocuments()?.remove(document)
        submission?.save(flush: true)
        if (document) {
            storageProviderService.removeStorageDocument(document, getUser()?.getDisplayName())
        }
        if (StorageDocument.findByUuid(params?.uuid)?.id) {
            response.status = 500
            render([error: "Unable to delete file"] as JSON)
        }

        response.status = 200
        render (['message': 'document deleted'] as JSON)
    }

    private static getJson(Class type, Object json) {
        Gson gson = new Gson()
        gson.fromJson(gson.toJson(json), type)

    }
}
