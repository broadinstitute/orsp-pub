<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main_component">
    <title>Sample Collection - Wizard</title>
</head>
<body>

<g:javascript>
    const sampleConsentLink = {
        isAdmin: "${session.isAdmin}",
        serverURL: "${webRequest.baseUrl}",
        projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
        loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
        roles: '${session.roles}'.replace(/\s+/g, '').replace("[", "").replace("]", "").split(","),
        consentNamesSearchURL: "${createLink(controller: 'consentGroup', action: 'consentGroupSummaries')}",
        sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
    };
</g:javascript>
<div id="sampleConsentLinkWizard"></div>
<asset:javascript src="build/sampleConsentLinkWizard.js"/>

</body>
</html>
