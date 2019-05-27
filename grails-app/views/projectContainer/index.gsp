<g:javascript>
    const projectReviewValues = {
     
    };

    const urls = {
        saveExtraPropUrl: "${createLink(controller: 'project', action: 'modifyExtraProperties')}"
    };
</g:javascript>
<!DOCTYPE html>
<html>
<head>
<meta name="layout" content="_footer">
  <meta name="layout" content="main">
    <meta name="layout" content="minimal">
    <meta name="layout" content="main_component">
    <title>Historial</title>
</head>
<body>

<div id="projectContainer"></div>
<asset:javascript src="build/projectContainer.js"/>
</body>
</html>