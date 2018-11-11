<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <script type="application/javascript">
        // Using a component allows us to pass GSP values to javascript objects
        const component = {
            cclPostUrl: "${createLink(controller: 'admin', action: 'createConsentCollection')}",
            cclSummariesUrl: "${createLink(controller: 'admin', action: 'cclSummaries')}",
            consentKeySearchUrl: "${createLink(controller: 'admin', action: 'getMatchingConsents')}",
            projectKeySearchUrl: "${createLink(controller: 'admin', action: 'getMatchingProjects')}",
            sampleSearchUrl: "${createLink(controller: 'admin', action: 'getMatchingSampleCollections')}"
        };
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css">
    <title>Consent Collection Links</title>
</head>
<body>

<div id="app"></div>
<asset:javascript src="collectionLinks.js"/>

</body>
</html>
