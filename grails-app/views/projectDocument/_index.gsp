<g:javascript>
    const component = {
      projectKey:'${issue.projectKey}',
      attachedDocumentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
      attachDocumentsUrl: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
      projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
      roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(","),
      rejectDocumentUrl: "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
      approveDocumentUrl: "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
      isAdmin: JSON.parse("${session.isAdmin}"),
      downloadDocumentUrl: "${createLink(controller: 'authenticated', action: 'downloadDocument')}"
    };

 </g:javascript>

 <div id="projectDocument"></div>
<asset:javascript src="projectDocument.js"/>
