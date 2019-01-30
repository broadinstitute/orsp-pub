<g:javascript>
    const consentGroupReviewComponent = {
      consentKey:'${issue.projectKey}',
      consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
      isAdminUrl: "${createLink(controller: 'authenticated', action: 'isCurrentUserAdmin')}",
      sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
      rejectConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'delete')}",
      projectKey: "${params.projectKey}",
      serverURL: "${webRequest.baseUrl}",
      updateConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'update')}",
      approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'approveConsentGroup')}",
      discardReviewUrl: "${createLink(controller: 'issueReview', action: 'delete')}",
    };

</g:javascript>

<div id="consentGroupReview"></div>
<asset:javascript src="consentGroupReview.js"/>
