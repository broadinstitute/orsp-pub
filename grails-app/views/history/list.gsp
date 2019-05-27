<html>
<head>
    <meta name="layout" content="minimal">
    <title>History</title>
</head>
<div id="footer"></div>
<asset:javascript src="build/footer.js"/>
<body>

<div class="container col-md-11">
    <table id="history-table" class="table table-bordered table-striped table-condensed table-hover">
        <thead>
            <tr>
                <th>Author</th>
                <th>Date</th>
                <th>Summary</th>
            </tr>
        </thead>
        <tbody>
        <g:each in="${events}" var="event">
            <tr>
                <td>${event.author}</td>
                <td><g:formatDate format="MM/dd/yyyy HH:mm:ss" date="${event.created}"/></td>
                <td>${event.summary}</td>
            </tr>
        </g:each>
    </tbody>
</table>
</div>

</body>
</html>