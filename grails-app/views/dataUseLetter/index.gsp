<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main_component"/>
    <title>Data Use Letter</title>
</head>
<body>

<div id="dataUseLetter"></div>
<asset:javascript src="build/dataUseLetter.js"/>

<g:javascript>
    const component = {
      sourceDiseases: "${createLink(controller: 'search', action: 'getMatchingDiseaseOntologies')}",
    }
</g:javascript>
</body>
</html>
