<g:javascript>
    const consentGroupDocumentsComponent = {
        projectKey:'${issue.projectKey}',
        attachmentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
        serverURL: "${webRequest.baseUrl}",
        attachDocumentsUrl: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
        rejectDocumentUrl: "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
        approveDocumentUrl: "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
        sessionUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
        downloadDocumentUrl: "${createLink(controller: 'authenticated', action: 'downloadDocument')}",
        loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}"
    };
</g:javascript>

 <div id="projectReview"></div>
<asset:javascript src="consentGroupDocuments.js"/>