<g:javascript>
    const projectReviewValues = {
        projectKey:'${issue.projectKey}',
        projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
        roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(","),
        searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
        isAdmin: "${session.isAdmin}",
        rejectProjectUrl: "${createLink(controller: 'project', action: 'delete')}",
        updateProjectUrl: "${createLink(controller: 'project', action: 'update')}",
        serverURL: "${webRequest.baseUrl}",
        discardReviewUrl: "${createLink(controller: 'issueReview', action: 'delete')}",
        clarificationUrl: "${createLink(controller: 'clarification', action: 'addClarificationRequest', method: 'POST')}",
        loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}"
    };

    const urls = {
        saveExtraPropUrl: "${createLink(controller: 'project', action: 'modifyExtraProperties')}"
    };
</g:javascript>

<div id="projectReview"></div>
<asset:javascript src="build/projectReview.js"/>
