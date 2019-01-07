<g:javascript>

    const component = {
      consentKey:'${issue.projectKey}',
      consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}"
    };

</g:javascript>

<div id="consentReview"></div>
<asset:javascript src="consentReview.js"/>