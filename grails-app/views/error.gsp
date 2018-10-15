<!DOCTYPE html>
<html>
	<head>
		<title><g:if env="development">Grails Runtime Exception</g:if><g:else>Error</g:else></title>
		<meta name="layout" content="main">
		<g:if env="development"><link rel="stylesheet" href="${resource(dir: 'css', file: 'errors.css')}" type="text/css"></g:if>
	</head>
	<body>
    <h1>Error</h1>
    <div class="alert alert-danger alert-dismissable" style="display: block">
        <g:if env="development">
            <g:renderException exception="${exception}" />
        </g:if>
        <g:else>
            <ul class="errors">
                <li>An error has occurred and recorded. It will be looked at by our engineers as soon as possible.</li>
            </ul>
        </g:else>
    </div>
	</body>
</html>
