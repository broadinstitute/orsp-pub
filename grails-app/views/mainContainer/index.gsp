<html>
  <head>

  <g:if test ="${openUrl}">
    <meta name="layout" content="unguarded_component"/>
  </g:if>
  <g:else>
    <meta name="layout" content="main">
    <meta name="layout" content="minimal">
    <meta name="layout" content="main_component">
  </g:else> 

    <title>ORSP</title>
  </head>

  <body>
    <div id="main"></div>
    <asset:javascript src="build/mainIndex.js"/>
  </body>
</html>
