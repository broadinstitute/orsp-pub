<g:javascript>

    const component = {
      consentKey:'${issue.projectKey}',
      consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
      isAdmin: "${session.isAdmin}"
    };

    const urls = {
        approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'approveConsentGroup')}"
    };

</g:javascript>

<div id="consentGroupReview"></div>
<asset:javascript src="consentGroupReview.js"/>
