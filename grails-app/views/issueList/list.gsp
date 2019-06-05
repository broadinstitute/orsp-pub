<html>
<head>
    <meta name="layout" content="main">
    <title>${header}</title>
</head>

<body>

<div class="container">

    <h3>${header}</h3>

    <div class="well">
        <table id="issuesList" class="table table-bordered table-hover">
            <thead>
            <tr>
                <th>Project</th>
                <th>Title</th>
                <th>Type</th>
                <th>Status</th>
                <th>Updated</th>
                <th>Awaiting action from</th>
            </tr>
            </thead>

            <tbody>
            <g:each in="${issues?}" status="i" var="instance">
                <tr>
                    <td>
                        <g:if test="${instance.controller}">
                            <g:link action="main" params="${[projectKey:instance.projectKey]}" controller="project">
                                ${instance.projectKey}
                            </g:link>
                        </g:if>
                        <g:else>${instance.projectKey}</g:else>
                    </td>
                    <td>
                        <g:if test="${instance.controller}">
                            <g:link action="main" params="${[projectKey:instance.projectKey]}" controller="project">
                                ${instance.summary}
                            </g:link>
                        </g:if>
                        <g:else>${instance.summary}</g:else>
                    </td>
                    <td>${instance.type}</td>
                    <td>
                        <g:if test="${instance.controller}">
                            <g:link action="main" params="${[projectKey:instance.projectKey]}" controller="project">
                                ${instance.status}
                            </g:link>
                        </g:if>
                        <g:else>${instance.status}</g:else>
                    </td>
                    <td><g:formatDate date="${instance.updateDate}" format="MM/dd/yyyy"/></td>
                    <td>
                        ${instance.actors?.join(", ")}
                    </td>
                </tr>
            </g:each>
            </tbody>
        </table>
    </div>
    <asset:script type="text/javascript">
        $(document).ready(function () {
            $.fn.dataTable.moment( 'M/D/YYYY' );
            $(".table").each(function() {
                $(this).DataTable({
                    dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
                    buttons: [ 'copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5', 'print' ],
                    language: { search: 'Filter:' },
                    pagingType: "full_numbers",
                    columnDefs: [ { targets: [0], type: "ticket"} ]
            });
        });
    });
    </asset:script>
</div>

</body>
</html>
