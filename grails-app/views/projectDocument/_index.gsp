<g:javascript>
    const user = {
        <g:if test="${session?.user}">
            displayName: "${session.user.displayName}",
            email: "${session.user.emailAddress}",
            userName: "${session.user.userName}"
        </g:if>
    };
    const component = {
      user: user,
      projectKey:'${issue.projectKey}',
      attachedDocumentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
      attachDocumentsUrl: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
      issue: '${issue.requestDate}',
      projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
      roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(","),
      downloadDocumentUrl: "${createLink(controller: 'authenticated', action: 'downloadDocument')}"
    };

 </g:javascript>

 <div id="projectDocument"></div>
<asset:javascript src="projectDocument.js"/>
