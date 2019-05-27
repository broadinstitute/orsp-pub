package org.broadinstitute.orsp

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        // TODO: Would prefer a better way to redirect a root url to a controller regardless of action.
        // Without the extra declarations, the default index action is always the one called even if /funding is hit.
        "/api/report"(controller: 'report', action: "index")
        "/api/report/funding"(controller: 'report', action: "funding")
        "/"(view:"/index")
        '/api/swagger/**'(controller: 'api', action: 'swagger')
        '/api/project'(resource: 'project')
        '/api/project/get-type'(controller: 'project', action: 'getProjectType', method: 'GET')
        '/api/project/delete'(controller: 'project', action: 'delete', method: 'DELETE')
        '/api/files-helper/attach-document'(controller: 'fileHelper', action: 'attachDocument', method: 'POST')
        '/api/files-helper/attached-documents'(controller: 'fileHelper', action: 'attachedDocuments', method: 'GET')
        '/api/files-helper/approve-document'(controller: 'fileHelper', action: 'approveDocument', method: 'PUT')
        '/api/files-helper/reject-document'(controller: 'fileHelper', action: 'rejectDocument', method: 'PUT')
        '/api/files-helper/update'(controller: 'fileHelper', action: 'updateDocumentsVersion', method: 'PUT')
        '/api/files-helper/delete'(controller: 'fileHelper', action: 'deleteDocument', method: 'DELETE')
        '/api/consent-group'(resource: 'newConsentGroup')
        '/api/consent-group/delete'(controller: 'newConsentGroup', action: 'delete', method: 'DELETE')
        '/api/consent-group/associatedProjects'(controller: 'newConsentGroup', action: 'getConsentCollectionLinks', method: 'GET')
        '/api/consent-group/unlinkAssociatedProjects'(controller: 'newConsentGroup', action: 'unlinkAssociatedProjects', method: 'PUT')
        '/api/issue-review'(controller: 'issueReview', action:'delete', method: 'DELETE')
        '/api/issue-review'(controller: 'issueReview', action: 'show', method: 'GET')
        '/api/issue-review'(controller: 'issueReview', action: 'save', method: 'POST')
        '/api/issue-review'(controller: 'issueReview', action: 'update', method: 'PUT')
        '/api/infoLink'(controller: 'infoLink', action: 'getProjectSampleCollections', method: 'GET')
        '/api/dataUseLetter'(controller: 'dataUseLetter', action: 'create', method: 'POST')
        '/api/dataUseLetter'(controller: 'dataUseLetter', action: 'update', method: 'PUT')
        '/api/dataUseLetter'(controller: 'dataUseLetter', action: 'show', method: 'GET')
        '/api/dataUseLetter/pdf'(controller: 'dataUseLetter', action: 'createPdf', method: 'POST')
        '/api/dataUseLetter/restriction'(controller: 'dataUseLetter', action: 'createSdul', method: 'POST')
        '/api/dul-email-notification'(controller: 'dulNotify', action: 'sendNotifications', method: 'POST')
        '/api/clarification-request/'(controller: 'clarification', action: 'addClarificationRequest', method: 'POST')
        '/api/sample-consent-link'(controller: 'sampleConsentLink', action: 'save', method: 'POST')


        '/api/history'(controller: 'history', action: 'list', method: 'GET')

        // Custom Error handlers.
        "500"(controller: "error", action: "error500")
        "404"(controller: "error", action: "error404")
        "403"(controller: "error", action: "error403")

        // Handle observed fishing attempts
        "/sdk"                          (controller: "error", action: "error403")
        "/Rapid7"                       (controller: "error", action: "error403")
        "/dyndata.js"                   (controller: "error", action: "error403")
        "/en/welcomeRes.js"             (controller: "error", action: "error403")
        "/console/login/LoginForm.jsp"  (controller: "error", action: "error403")
        "/.git**"                       (controller: "error", action: "error403")
        "/.svn**"                       (controller: "error", action: "error403")
        "/.hg**"                        (controller: "error", action: "error403")
        "/.bzr**"                       (controller: "error", action: "error403")
    }

}
