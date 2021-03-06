<html>
<head>
    <title>${issue.typeLabel} ${issue?.projectKey}</title>
    <link rel="stylesheet" href="${requestContextPath}${resource(dir: 'css', file: 'print.css')}"/>
</head>
<body>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3>${issue?.projectKey}</h3>
    </div>
    <div class="panel-body">
        <p>${issue?.typeLabel}</p>
        <p>Summary: ${issue?.summary}</p>
        <p>Status: ${issue?.status}</p>
    </div>
</div>

<g:render template="/irb/details" model="[issue: issue,
                                     collectionLinks: collectionLinks,
                                     extraProperties: extraProperties]"/>

</body>
</html>