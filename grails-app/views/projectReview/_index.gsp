<g:javascript>


    const component = {
    issue: '${issue.requestDate}',
    projectKey:'${issue.projectKey}',

    projectUrl: "${createLink(controller: 'project', action: 'getproject')}"
    };

</g:javascript>

<div id="projectReview"></div>
<asset:javascript src="projectReview.js"/>
