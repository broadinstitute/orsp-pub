<g:javascript>
    const component = {
        projectKey:'${issue.projectKey}',
        attachmentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
        serverURL: "${webRequest.baseUrl}",
        attachDocumentsUrl: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
        rejectDocumentUrl: "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
        approveDocumentUrl: "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
         isAdminUrl: "${createLink(controller: 'authenticated', action: 'isCurrentUserAdmin')}",
        downloadDocumentUrl: "${createLink(controller: 'authenticated', action: 'downloadDocument')}"
    };
</g:javascript>

 <div id="projectReview"></div>
<asset:javascript src="consentGroupDocuments.js"/>