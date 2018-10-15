<!DOCTYPE html>
<html>
<head>
    <title>Page Not Found</title>
    <meta name="layout" content="main">
    <g:if env="development"><asset:stylesheet src="errors.css"/></g:if>
</head>

<body>
<div class="container">
    <h1>Error</h1>

    <div class="alert alert-danger alert-dismissable" style="display: block">
        <ul>
            <li>Page Not Found</li>
            <li>Path: ${request.forwardURI}</li>
        </ul>
    </div>
</div>
</body>
</html>
