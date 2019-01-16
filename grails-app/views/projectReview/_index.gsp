<g:javascript>
    const projectReviewValues = {
        issue: '${issue.requestDate}',
        projectKey:'${issue.projectKey}',
        projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
        roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(",")
    };

    const urls = {
        saveExtraPropUrl: "${createLink(controller: 'project', action: 'modifyExtraProperties')}"
    };
</g:javascript>

<div id="projectReview"></div>
<asset:javascript src="projectReview.js"/>
