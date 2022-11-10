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
        "/api/report/get-funding"(controller: 'report', action: "getFunding", method: 'GET')
        "/api/report/get-all-fundings"(controller: 'report', action: "getAllFundings", method: 'GET')
        "/api/report/review-categories"(controller: 'report', action: "findReviewCategories")
        '/api/swagger/**'(controller: 'api', action: 'swagger')

        // Compliance report end point
        "/api/report/compliance-report"(controller: "report", action: "getComplianceReportDetails", method: "GET")

        // Project end points
        '/api/project'(resource: 'project')
        '/api/project'(controller:'project', action: 'save', method: 'POST')
        '/api/project/get-info'(controller: 'project', action: 'getProject', method: 'GET')
        '/api/project/get-type'(controller: 'project', action: 'getProjectType', method: 'GET')
        '/api/project/reject'(controller: 'project', action: 'delete', method: 'DELETE')
        '/api/project/update'(controller: 'project', action: 'update', method: 'PUT')
        '/api/project/updateKey'(controller: 'project', action: 'updateKey', method: 'PUT')
        '/api/project/extra-properties'(controller: 'project', action: 'modifyExtraProperties', method: 'POST')
        '/api/project/update-properties'(controller: 'project', action: 'update')
        '/api/project/update-admin-props'(controller: 'project', action: 'updateAdminOnlyProps')
        '/api/user/projects'(controller: 'issueList', action: 'getProjectsForUser')
        '/api/project/remove-assigned-admin'(controller: 'project', action:'removeAssignedAdmin')

        // Consent Group end-points
        '/api/consent-group'(resource: 'newConsentGroup')
        '/api/consent-group/delete'(controller: 'newConsentGroup', action: 'delete', method: 'DELETE')
        '/api/consent-group/hard-delete'(controller: 'newConsentGroup', action: 'hardDelete', method: 'DELETE')
        '/api/consent-group/associated-projects'(controller: 'newConsentGroup', action: 'getConsentCollectionLinks', method: 'GET')
        '/api/consent-group/unlink-associated-projects'(controller: 'newConsentGroup', action: 'unlinkAssociatedProjects', method: 'PUT')
        '/api/consent-group/unlink-associated-sample-collection'(controller: 'newConsentGroup', action: 'unlinkAssociatedSampleCollection', method: 'PUT')
        '/api/consent-group/find-by-uuid'(controller: 'dataUseLetter', action: 'findByUUID')
        '/api/consent-group/create'(controller:'newConsentGroup', action: 'save', method: 'POST')
        '/api/consent-group/get-fillable-pdf'(controller: 'newConsentGroup', action: 'downloadFillablePDF', method: 'GET')
        '/api/consent-group/use-restriction'(controller:'newConsentGroup', action: 'getDataUseRestriction')
        '/api/consent-group/exported'(controller:'newConsentGroup', action: 'getExportedConsentGroup')
        '/api/consent-group/sample-collections'(controller: 'consentGroup', action: 'getConsentGroupSampleCollections')
        '/consent-group/name-search'(controller: 'consentGroup', action: 'getConsentGroups')
        '/consent-group/sample-search'(controller: 'consentGroup', action: 'unConsentedSampleCollections')
        '/consent-group/new'(controller:'newConsentGroup', action:'renderMainComponent')
        '/api/consent-group/delete-consent-reason'(controller:'newConsentGroup', action:'deleteNoConsentReason', method: 'DELETE')
        '/api/consent-group/approve'(controller: 'newConsentGroup', action: 'approveConsentGroup')
        '/api/consent-group'(controller: 'newConsentGroup', action: 'update', method: 'PUT')
        '/api/consent-group/review'(controller: 'consentGroup', action: 'getConsentGroup', method: 'GET')
        '/api/consent-group/upload-modal'(controller: 'consentGroup', action: 'loadModalWindow', method: 'GET')
        '/api/consent-group/get-project-consent-groups'(controller:'newConsentGroup', action:'getProjectConsentGroups', method: 'GET')
        '/api/consent-groups/matching-name'(controller: 'newConsentGroup', action: 'matchConsentName', method: 'GET')

        // File related end points
        '/api/files-helper/attach-document'(controller: 'fileHelper', action: 'attachDocument', method: 'POST')
        '/api/files-helper/attached-documents'(controller: 'fileHelper', action: 'attachedDocuments', method: 'GET')
        '/api/files-helper/approve-document'(controller: 'fileHelper', action: 'approveDocument', method: 'PUT')
        '/api/files-helper/reject-document'(controller: 'fileHelper', action: 'rejectDocument', method: 'PUT')
        '/api/files-helper/remove-attachment'(controller: 'fileHelper', action: 'deleteDocumentByUuid', method: 'DELETE')
        '/api/files-helper/update'(controller: 'fileHelper', action: 'updateDocumentsVersion', method: 'PUT')
        '/api/files-helper/delete'(controller: 'fileHelper', action: 'deleteDocument', method: 'DELETE')
        '/api/files-helper/get-document'(controller: 'fileHelper', action: 'getDocument')

        // Issue review end points
        '/api/issue-review'(controller: 'issueReview', action:'delete', method: 'DELETE')
        '/api/issue-review'(controller: 'issueReview', action: 'show', method: 'GET')
        '/api/issue-review'(controller: 'issueReview', action: 'save', method: 'POST')
        '/api/issue-review'(controller: 'issueReview', action: 'update', method: 'PUT')

        // Data use letter end points
        '/api/data-use-letter/save-dul'(controller: 'dataUseLetter', action: 'create', method: 'POST')
        '/api/data-use-letter'(controller: 'dataUseLetter', action: 'update', method: 'PUT')
        '/api/data-use-letter'(controller: 'dataUseLetter', action: 'create', method: 'POST')
        '/api/data-use-letter'(controller: 'dataUseLetter', action: 'getDul', method: 'GET')
        '/api/data-use-letter/pdf'(controller: 'dataUseLetter', action: 'createPdf', method: 'POST')
        '/api/data-use/restriction/create'(controller: 'dataUseLetter', action: 'saveSdul', method: 'POST')

        '/api/dul-email-notification'(controller: 'dulNotify', action: 'sendNotifications', method: 'POST')
        '/api/clarification-request/collection'(controller: 'clarification', action: 'collectionRequestClarification', method: 'POST')
        '/api/clarification-request'(controller: 'clarification', action: 'addClarificationRequest', method: 'POST')
        '/api/sample-consent-link'(controller: 'sampleConsentLink', action: 'save', method: 'POST')
        '/api/get-users'(controller: 'user', action: 'getOrspUsers', method: 'GET')
        '/api/missing-users'(controller: 'user', action: 'index', method: 'GET')
        '/api/sync-users'(controller: 'user', action: 'sync', method: 'GET')
        '/api/edit-user-role'(controller: 'user', action: 'editOrspUserRole', method: 'PUT')
        '/api/user/authenticated/user-data'(controller: 'authenticated', action: 'getSessionUser')
        '/api/user/authenticated/user-session'(controller: 'authenticated', action: 'hasSession')
        '/api/user/authenticated/download-document'(controller: 'authenticated', action: 'downloadDocument')
        '/api/user/authenticated'(controller: 'authenticated', action: 'isCurrentUserAdmin')

        // Organizations/Companies end points
        '/api/delete-organization'(controller: 'organization', action: 'deleteOrganization', method: 'DELETE')
        '/api/edit-organization'(controller: 'organization', action: 'editOrganization', method: 'PUT')
        '/api/add-organization'(controller: 'organization', action: 'addOrganization', method: 'POST')
        '/api/get-organizations'(controller: 'organization', action: 'getOrganizations', method: 'GET')

        // Search end points
        '/search/matching-users'(controller: 'search', action: 'getMatchingUsers')
        '/search/project-key/autocomplete'(controller: 'search', action: 'projectKeyAutocomplete')
        '/search/matching-diseases-ontologies'(controller: 'dataUseLetter', action: 'getMatchingDiseaseOntologies')
        '/search/general-table-json'(controller: 'search', action: 'generalReactTablesJsonSearch')
        '/search/matching-population-ontologies'(controller: 'search', action: 'getMatchingPopulationOntologies')
        '/search/matching-issues'(controller:'search', action:'getMatchingIssues')
        '/search/matching-collections'(controller:'search', action:'getMatchingCollections')
        '/search/orsp-admins'(controller: 'search', action: 'getORSPAdmins')

        '/api/dur'(controller: 'dataUse', action:'findDataUseRestrictions')
        '/api/collection-links'(controller: 'report', action: 'findCollectionLinks')
        '/api/qa-event-report'(controller: 'statusEvent', action: 'findQaEventReport', method: 'GET')
        '/api/qa-project-event-report'(controller: 'statusEvent', action: 'findProjectReport', method:'GET')
        '/api/consent-collection-links'(controller: 'report', action: 'getAllConsentCollectionLinks')
        '/api/comments/save'(controller: 'comments', action: 'saveNewComment', method: 'POST')
        '/api/comments/list'(controller: 'comments', action: 'getComments', method: 'GET')
        '/api/history'(controller: 'history', action: 'list', method: 'GET')

        '/api/submissions'(controller: 'submission', action: 'show', method: 'GET')
        '/api/submissions/validate-number'(controller: 'submission', action: 'validateSubmissionNumber', method: 'GET')
        '/api/submissions'(controller: 'submission', action: 'delete', method: 'DELETE')
        '/api/submissions/display'(controller: 'submission', action: 'getSubmissions', method: 'GET')
        '/api/submissions/info'(controller: 'submission', action: 'index', method: 'GET')
        '/submissions/add-new'(controller: 'submission', action: 'renderMainComponent', method: 'GET')
        '/api/submissions/add-new-old'(controller: 'submission', action: 'index', method: 'GET')
        '/api/submissions/save-new'(controller: 'submission', action: 'save', method: 'POST')
        '/api/submissions/add-new'(controller: 'submission', action: 'save', method: 'POST')
        '/api/data-use/save'(controller: 'dataUse', action: 'save')
        '/api/submission/remove-file'(controller: 'submission', action: 'removeFile', method: 'DELETE')

        '/api/data-use/restriction'(controller: 'dataUse', action: 'findRestriction')
        '/api/consent/export'(controller: 'dataUse', action: 'exportConsent', method: 'POST')

        '/api/info-link'(controller: 'infoLink', action: 'getProjectSampleCollections', method: 'GET')
        '/api/break-link'(controller: 'consentGroup', action: 'breakLink', method: 'POST')

        '/api/approve-link'(controller: 'newConsentGroup', action: 'approveLink', method: 'PUT')
        '/api/submit-to-irb-link'(controller: 'newConsentGroup', action: 'submittedToIRBLink', method: 'PUT')

        '/api/osap/data-feed'(controller: 'api', action: 'osapDataFeed', method: 'GET')

        '/api/issue-list'(controller: 'issueList', action: 'issueItems', method: 'GET')
        '/api/auth'(controller: 'auth', action: 'authUser')

        // Login text end point
        '/api/login-text'(controller: 'loginText', action: 'getLoginText', method: 'GET')
        '/api/edit-login-text'(controller: 'loginText', action: 'updateLoginText', method: 'PUT')
        '/api/login-text-response'(controller: 'loginText', action: 'getLoginTextResponse', method: 'GET')

        // Document description update endpoint
        'api/update-document-description'(controller: 'fileHelper', action: 'updateDocumentDescriptionByUuid', method: 'PUT')

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
        "/**"                           (controller: "index", action: "index")
    }

}
