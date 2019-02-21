<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main"/>
    <meta charset="utf-8"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"/>
    <title>Data Use Letter</title>

    <script type="application/javascript">
    const dataUseLetterComponent = {
        serverURL: "${webRequest.baseUrl}",
        consentGroupUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
        projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
        error: "${error}"
    };
    </script>
</head>
<body>

<div id="dataUseLetter"></div>
<asset:javascript src="dataUseLetter.js"/>

</body>
</html>
