<g:javascript>
    const adminOnlyComponent = {
    projectKey:'${issue.projectKey}',
    projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
    isAdmin: "${session.isAdmin}",
    loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
    userSessionUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
    updateProjectUrl: "${createLink(controller: 'project', action: 'update')}"
    };
</g:javascript>

<div id="adminOnly"></div>
<asset:javascript src="build/adminOnly.js"/>
