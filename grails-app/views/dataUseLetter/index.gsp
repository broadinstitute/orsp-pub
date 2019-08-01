<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="unguarded_component"/>
    <title>Data Use Letter</title>
     <script type="application/javascript">
        // Using a component allows us to pass GSP values to javascript objects
        const component = {
            error: "${error}",
            loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
            serverURL: "${webRequest.baseUrl}",
            consentGroupUrl:  "${createLink(controller: 'newConsentGroup', action: 'findByUUID')}",
            projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
            sourceDiseases: "${createLink(controller: 'search', action: 'getMatchingDiseaseOntologies')}",
            contextPath: "${request.contextPath}"
        };
    </script>

</head>
<body>

<div id="dataUseLetter"></div>
<asset:javascript src="build/dataUseLetter.js"/>

</body>
</html>
