<g:javascript>

    const component = {
      consentKey:'${issue.projectKey}',
      consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}"
    };

    const urls = {
        approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'updateConsentGroup')}"
    };

</g:javascript>

<div id="consentGroupReview"></div>
<asset:javascript src="consentGroupReview.js"/>