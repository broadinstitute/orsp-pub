<g:javascript>
    const consentGroupReviewComponent = {
      consentKey:'${issue.projectKey}',
      consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
      isAdminUrl: "${createLink(controller: 'authenticated', action: 'isCurrentUserAdmin')}",
      sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
      rejectConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'delete')}",
      projectKey: "${params.projectKey}",
      serverURL: "${webRequest.baseUrl}"
    };

    const urls = {
        approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'approveConsentGroup')}"
    };

</g:javascript>

<div id="consentGroupReview"></div>
<asset:javascript src="consentGroupReview.js"/>
