<g:javascript>
    const projectReviewValues = {
        projectKey:'${issue.projectKey}',
        projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
        roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(","),
        searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
        isAdmin: "${session.isAdmin}",
        rejectProjectUrl: "${createLink(controller: 'project', action: 'delete')}",
        serverURL: "${webRequest.baseUrl}"
    };

    const urls = {
        saveExtraPropUrl: "${createLink(controller: 'project', action: 'modifyExtraProperties')}"
    };
</g:javascript>

<div id="projectReview"></div>
<asset:javascript src="projectReview.js"/>
