<html>
<head>
    <meta name="layout" content="main">
    <title>Quality Assurance Report for ${issue.projectKey}</title>
</head>

<body>

<h1>Quality Assurance Report for
    <a href="${createLink(controller: issue.controller, action: "show", params: [id: issue.projectKey])}">${issue.projectKey}</a>
</h1>

<div class="container-fluid well">
    <table id="eventsList" class="table table-hover table-bordered">
        <thead>
        <tr>
            <th>Status</th>
            <th>Author</th>
            <th>Status Date</th>
            <th>Duration</th>
        </tr>
        </thead>
        <tbody>
        <g:each in="${statusEvents}" var="event">
            <tr>
                <td>${event.event.summary}</td>
                <td>${event.event.author}</td>
                <td><g:formatDate date="${event.event.created}" format="EEE, d MMM yyyy, hh:mm:ss aaa"/></td>
                <td><duration:period period="${event.duration}"/></td>
            </tr>
        </g:each>
        </tbody>
    </table>
</div>
</body>
</html>

<asset:script type="text/javascript">
    $(document).ready(function () {
        $("#eventsList").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [],
            language: { search: 'Filter:' },
            paging: false,
            ordering: false
        });
    });
</asset:script>
