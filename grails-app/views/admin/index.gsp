<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <title>Administrative Functions</title>
</head>

<body>

    <div class="container">

        <h2>Administrative Functions</h2>

        <ul>
            <li><a href="${createLink(controller: 'dataUse', action: 'list')}">Data Use Restrictions</a></li>
            <li><a href="${createLink(controller: 'admin', action: 'reviewCategories')}">Review Category Report</a></li>
            <li><a href="${createLink(controller: 'statusEvent', action: 'index')}">QA Event Report</a></li>
            <li><a href="${createLink(controller: 'admin', action: 'fundingReport')}">Funding Source Report</a></li>
            <li><a href="${createLink(controller: 'report', action: 'aahrppMetrics')}">AAHRPP Metrics Report (CSV)</a></li>
        </ul>

    </div>
</body>
</html>
