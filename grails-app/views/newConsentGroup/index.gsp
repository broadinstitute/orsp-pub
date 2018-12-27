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
        const user = {
            <g:if test="${session?.user}">
                displayName: "${session.user.displayName}",
                email: "${session.user.emailAddress}",
                userName: "${session.user.userName}"
            </g:if>
        };
        const component = {
            user: user,
            searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
            sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
            consentNamesSearchURL: "${createLink(controller: 'consentGroup', action: 'consentGroupSummaries')}",
            attachDocumentsURL: "${createLink(controller: 'project', action: 'attachDocument', uri: '/api/project/attach-document', method: 'POST')}",
            createConsentGroupURL: "${createLink(controller:'newConsentGroup', action: 'save', uri: '/api/newConsentGroup', method: 'POST')}",
            serverURL: "${webRequest.baseUrl}",
            fillablePdfURL : "${createLink(controller: 'newConsentGroup', action: 'downloadFillablePDF')}",
            projectKey: "${params.projectKey}"
        };
    </script>
</head>
<body>
<div id="newConsentGroup"></div>
<asset:javascript src="consentGroup.js"/>

</body>
</html>
