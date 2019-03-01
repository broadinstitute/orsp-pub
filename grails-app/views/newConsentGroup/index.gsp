<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <meta charset="utf-8"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css">
    <title>Consent Group</title>
    <script type="application/javascript">

        const component = {
            getUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
            searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
            sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
            consentNamesSearchURL: "${createLink(controller: 'consentGroup', action: 'consentGroupSummaries')}",
            createConsentGroupURL: "${createLink(controller:'newConsentGroup', action: 'save', uri: '/api/consent-group', method: 'POST')}",
            attachDocumentsURL: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
            serverURL: "${webRequest.baseUrl}",
            fillablePdfURL : "${createLink(controller: 'newConsentGroup', action: 'downloadFillablePDF', method: 'GET')}",
            projectKey: "${params.projectKey}",
            loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
            projectType: '${params.type}'
        };
    </script>
</head>
<body>
<div id="newConsentGroup"></div>
<asset:javascript src="consentGroup.js"/>

</body>
</html>
