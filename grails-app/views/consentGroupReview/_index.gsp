<g:javascript>

    const consentGroupReviewComponent = {
      consentKey:'${issue.projectKey}',
      consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
      isAdminUrl: "${createLink(controller: 'authenticated', action: 'isCurrentUserAdmin')}"
    };

    const urls = {
        approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'approveConsentGroup')}"
    };

</g:javascript>

<div id="consentGroupReview"></div>
<asset:javascript src="consentGroupReview.js"/>
