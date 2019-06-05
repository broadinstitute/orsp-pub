<html>
    <head>
        <meta name="layout" content="main_component">
        <title>Consent Group</title>
    </head>
    <body>
        <g:javascript>
            const infoLinkConstant = {
                cclId: "${params.cclId}"
            };
        </g:javascript>
        <div id="infoLink"></div>
        <asset:javascript src="build/infoLink.js"/>
    </body>
</html>
