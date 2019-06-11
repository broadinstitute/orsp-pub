<html>
  <head>
    <meta name="layout" content="main_component">
    <title>Consent Group</title>
  </head>
  <body>
    <g:javascript>
      const consentGroupReviewComponent = {
        consentKey:'${issue.projectKey}',
        consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
        rejectConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'delete')}",
        projectKey: "${params.projectKey}",
        updateConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'update')}",
        approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'approveConsentGroup')}"
      };
    </g:javascript>

    <div id="consentGroupReview"></div>

    <asset:javascript src="build/consentGroupReview.js"/>
  </body>
</html>
