<g:javascript>
    const component = {
      projectKey:'${issue.projectKey}',
      attachedDocumentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
      attachDocumentsUrl: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
      projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
      roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(","),
      rejectDocumentUrl: "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
      approveDocumentUrl: "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
      downloadDocumentUrl: "${createLink(controller: 'authenticated', action: 'downloadDocument')}",
      sessionUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
      loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}"
    };

</g:javascript>

<div id="projectDocument"></div>
<asset:javascript src="build/projectDocument.js"/>
