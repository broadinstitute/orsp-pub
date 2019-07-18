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

        // Project end points
        '/api/project'(resource: 'project')
        '/api/project'(controller:'project', action: 'save', method: 'POST')
        '/api/project/get-info'(controller: 'project', action: 'getProject', method: 'GET')
        '/api/project/get-type'(controller: 'project', action: 'getProjectType', method: 'GET')
        '/api/project/reject'(controller: 'project', action: 'delete', method: 'DELETE')
        '/api/project/update'(controller: 'project', action: 'update', method: 'PUT')
        '/api/project/extra-properties'(controller: 'project', action: 'modifyExtraProperties', method: 'POST')
        '/api/project/update-properties'(controller: 'project', action: 'update')
        '/api/project/update-admin-props'(controller: 'project', action: 'updateAdminOnlyProps')

        // File related end points
        '/api/files-helper/attach-document'(controller: 'fileHelper', action: 'attachDocument', method: 'POST')
        '/api/files-helper/attached-documents'(controller: 'fileHelper', action: 'attachedDocuments', method: 'GET')
        '/api/files-helper/approve-document'(controller: 'fileHelper', action: 'approveDocument', method: 'PUT')
        '/api/files-helper/reject-document'(controller: 'fileHelper', action: 'rejectDocument', method: 'PUT')
        '/api/files-helper/update'(controller: 'fileHelper', action: 'updateDocumentsVersion', method: 'PUT')
        '/api/files-helper/delete'(controller: 'fileHelper', action: 'deleteDocument', method: 'DELETE')

        // Consent Group end-points
        '/api/consent-group'(resource: 'newConsentGroup')
        '/api/consent-group/delete'(controller: 'newConsentGroup', action: 'delete', method: 'DELETE')
        '/api/consent-group/associatedProjects'(controller: 'newConsentGroup', action: 'getConsentCollectionLinks', method: 'GET')
        '/api/consent-group/unlinkAssociatedProjects'(controller: 'newConsentGroup', action: 'unlinkAssociatedProjects', method: 'PUT')
        '/api/consent-group/unlinkAssociatedSampleCollection'(controller: 'newConsentGroup', action: 'unlinkAssociatedSampleCollection', method: 'PUT')
        '/api/consent-group/find-by-uuid'(controller: 'newConsentGroup', action: 'findByUUID')
        '/api/consent-group/create'(controller:'newConsentGroup', action: 'save', method: 'POST')
        '/api/consent-group/get-fillable-pdf'(controller: 'newConsentGroup', action: 'downloadFillablePDF', method: 'GET')
        '/aip/consent-group/use-restriction'(controller:'newConsentGroup', action: 'getDataUseRestriction')
        '/api/consent-group/sample-collections'(controller: 'consentGroup', action: 'getConsentGroupSampleCollections')
        '/consent-group/name-search'(controller: 'consentGroup', action: 'consentGroupSummaries')
        '/consent-group/sample-search'(controller: 'consentGroup', action: 'unConsentedSampleCollections')
        '/api/consent-group/approve'(controller: 'newConsentGroup', action: 'approveConsentGroup')
        '/api/consent-group'(controller: 'newConsentGroup', action: 'update', method: 'PUT')
        '/api/consent-group/review'(controller: 'consentGroup', action: 'getConsentGroup', method: 'GET')

        // Issue review end points
        '/api/issue-review'(controller: 'issueReview', action:'delete', method: 'DELETE')
        '/api/issue-review'(controller: 'issueReview', action: 'show', method: 'GET')
        '/api/issue-review'(controller: 'issueReview', action: 'save', method: 'POST')
        '/api/issue-review'(controller: 'issueReview', action: 'update', method: 'PUT')
        '/api/info-link'(controller: 'infoLink', action: 'getProjectSampleCollections', method: 'GET')

        // Data use letter end points
        '/api/data-use-letter/save-dul'(controller: 'dataUseLetter', action: 'create', method: 'POST')
        '/api/data-use-letter'(controller: 'dataUseLetter', action: 'update', method: 'PUT')
        '/api/data-use-letter'(controller: 'dataUseLetter', action: 'show', method: 'GET')
        '/api/data-use-letter/pdf'(controller: 'dataUseLetter', action: 'createPdf', method: 'POST')
        '/api/data-use-letter/restriction'(controller: 'dataUseLetter', action: 'createSdul', method: 'POST')

        '/api/dul-email-notification'(controller: 'dulNotify', action: 'sendNotifications', method: 'POST')
        '/api/clarification-request/'(controller: 'clarification', action: 'addClarificationRequest', method: 'POST')
        '/api/sample-consent-link'(controller: 'sampleConsentLink', action: 'save', method: 'POST')
        '/api/get-users'(controller: 'user', action: 'getOrspUsers', method: 'GET')
        '/api/edit-user-role'(controller: 'user', action: 'editOrspUserRole', method: 'PUT')
        '/api/user/authenticated/user-data'(controller: 'authenticated', action: 'getSessionUser')
        '/api/user/authenticated/download-document'(controller: 'authenticated', action: 'downloadDocument')
        '/api/user/authenticated'(controller: 'authenticated', action: 'isCurrentUserAdmin')

        // Search end points
        '/search/matching-users'(controller: 'search', action: 'getMatchingUsers')
        '/search/project-key/autocomplete'(controller: 'search', action: 'projectKeyAutocomplete')
        '/search/matching-diseases-ontologies'(controller: 'search', action: 'getMatchingDiseaseOntologies')
        '/search/general-table-json'(controller: 'search', action: 'generalReactTablesJsonSearch')

        '/api/comments/save'(controller: 'comments', action: 'saveNewComment', method: 'POST')
        '/api/comments/list'(controller: 'comments', action: 'getComments', method: 'GET')
        '/api/history'(controller: 'history', action: 'list', method: 'GET')
        '/api/submissions'(controller: 'submission', action: 'show', method: 'GET')
        '/api/consent-groups'(controller: 'consentGroup', action: 'projectConsentGroups', method: 'GET')
        '/api/consent-group/upload-modal'(controller: 'consentGroup', action: 'loadModalWindow', method: 'GET')
        '/api/data-use/new-restriction'(controller: 'dataUse', action: 'create')

        '/api/break-link'(controller: 'consentGroup', action: 'breakLink', method: 'POST')
        '/api/approve-link'(controller: 'newConsentGroup', action: 'approveLink', method: 'PUT')

        '/api/osap/data-feed'(controller: 'api', action: 'osapDataFeed', method: 'GET')
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
