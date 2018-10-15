<%@ page import="org.broadinstitute.orsp.IssueType" %>
<html>
<head>
    <meta name="layout" content="main">
    <title>Quality Assurance Report</title>
</head>

<body>

<h1>Quality Assurance Report</h1>

<div class="well">
    <h3>Filter Projects</h3>
    <g:form controller="statusEvent" class="form-horizontal" id="filterForm">
        <div class="form-group">
            <label for="after" class="col-sm-2 control-label">Created After</label>

            <div class="col-sm-10">
                <input class="datepicker" type="text" id="after" name="after" value="${params?.after}"/>
            </div>
        </div>

        <div class="form-group">
            <label for="before" class="col-sm-2 control-label">Created Before</label>

            <div class="col-sm-10">
                <input class="datepicker" type="text" id="before" name="before" value="${params?.before}"/>
            </div>
        </div>

        <div class="form-group">
            <label for="project_type" class="col-sm-2 control-label">Project Type</label>
            <div class="col-sm-10">
                <select id="project_type" name="project_type">
                    <option value="">All</option>
                    <option value="${IssueType.IRB.controller}">${IssueType.IRB.name}</option>
                    <option value="${IssueType.NE.controller}">${IssueType.NE.name}</option>
                    <option value="${IssueType.NHSR.controller}">${IssueType.NHSR.name}</option>
                </select>
            </div>
        </div>

        <div class="form-group">
            <div class="col-sm-offset-2 col-sm-10">
                <g:actionSubmit class="btn btn-primary" value="Filter" action="index"/>
                <button id="clear" class="btn btn-default">Clear</button>
            </div>
        </div>

    </g:form>
</div>

<div class="orsp-tabs" style="display: none;">
    <ul>
        <g:if test="${irbs.size() > 0}">
            <li><a href="#irbs">IRB Projects</a></li>
        </g:if>
        <g:if test="${nonIrbs.size() > 0}">
            <li><a href="#nonIrbs">Non IRB Projects</a></li>
        </g:if>
    </ul>

    <g:if test="${irbs.size() > 0}">
        <div id="irbs">

            <table id="irbList" class="table table-hover table-bordered">
                <thead>
                <tr>
                    <th></th>
                    <th>Project</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Age</th>
                    <th>Assignees</th>
                </tr>
                </thead>
                <tbody>
                <g:each in="${irbs}" var="issue" status="index">
                    <g:set var="period" value="${periodMap.get(issue.projectKey)}"/>
                    <tr>
                        <td>${index + 1}</td>
                        <td><a href="${createLink(controller: "statusEvent", action: "project", params: [id: issue?.projectKey])}">${issue?.projectKey}</a></td>
                        <td>${issue?.typeLabel}</td>
                        <td>${issue?.status}</td>
                        <td><duration:period period="${period}"/></td>
                        <td>${issue?.actorUsernames?.join(", ")}</td>
                    </tr>
                </g:each>
                </tbody>
            </table>
        </div>
    </g:if>

    <g:if test="${nonIrbs.size() > 0}">
        <div id="nonIrbs">
            <table id="nonIrbList" class="table table-hover table-bordered">
                <thead>
                <tr>
                    <th></th>
                    <th>Project</th>
                    <th>Type</th>
                    <th>Status</th>
                    <th>Age</th>
                    <th>Assignees</th>
                </tr>
                </thead>
                <tbody>
                <g:each in="${nonIrbs}" var="issue" status="index">
                    <g:set var="period" value="${periodMap.get(issue.projectKey)}"/>
                    <tr>
                        <td>${index + 1}</td>
                        <td><a href="${createLink(controller: "statusEvent", action: "project", params: [id: issue?.projectKey])}">${issue?.projectKey}</a></td>
                        <td>${issue?.typeLabel}</td>
                        <td>${issue?.status}</td>
                        <td><duration:period period="${period}"/></td>
                        <td>${issue?.actorUsernames?.join(", ")}</td>
                    </tr>
                </g:each>
                </tbody>
            </table>
        </div>
    </g:if>

</div>

</body>
</html>

<asset:script type="text/javascript">
    $(document).ready(function () {
        $("#clear").on('click', function(){
            location.href = "${createLink(controller: "statusEvent", action: "index", params: [after: "", before: ""])}";
        });
        $(".datepicker").datepicker({
          changeMonth: true,
          changeYear: true
        });
        $(".table").each(function() {
            $(this).DataTable({
                dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
                buttons: [ 'copyHtml5', 'excelHtml5', 'csvHtml5', 'pdfHtml5', 'print' ],
                language: { search: 'Filter:' },
                pagingType: "full_numbers",
                pageLength: 50,
                columnDefs: [ { targets: [1], type: "ticket"} ]
            });
        });
    });
</asset:script>
