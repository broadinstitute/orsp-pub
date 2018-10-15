<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<html>
<head>
    <meta name="layout" content="main">
    <title>Review Category Report</title>
</head>

<body>

<h1>Review Category Report</h1>

<div class="container">

    <table id="reviewCategories" class="table table-bordered table-striped">
        <thead>
        <tr>
            <th>Project</th>
            <th>Summary</th>
            <th>Status</th>
            <th>Review Category</th>
            <th>Close</th>
        </tr>
        </thead>
        <tbody>
        <g:each in="${issues}" var="issue" status="index">
            <tr>
                <td><a href="${createLink(controller: "irb", action: "show", params: [id: issue.projectKey])}">${issue.projectKey}</a></td>
                <td>${issue.summary}</td>
                <td>${issue.status}</td>
                <td>
                    ${issue.getReviewCategory()}
                </td>
                <td>
                    <g:if test="${issue.status?.equals(IssueStatus.Approved.name)}">
                        <g:render template="/base/actionConfirm"
                                  model="${[url: createLink(controller: 'admin', action: 'close', params: [id: issue.projectKey]),
                                            issue: issue,
                                            baseId: index,
                                            label: 'Close Project: ' + issue.projectKey,
                                            active: true]}"/>
                    </g:if>
                </td>
            </tr>
        </g:each>
        </tbody>
    </table>
</div>

</body>
</html>

<asset:script type="text/javascript">

    $(document).ready(function(){

        $("#reviewCategories").dataTable({
            "sDom": '<"H"Tfr>t<"F"lpi>',
            "oTableTools": {
                "sSwfPath": "${request.contextPath}/javascripts/media/swf/copy_csv_xls.swf",
                "aButtons": [ "copy", "csv", "xls"]
            },
            "bJQueryUI": true,
            "bInfo": false,
            "oLanguage": { sSearch: 'Filter:' },
            "sPaginationType": "full_numbers",
            "iDisplayLength": 50,
            "aoColumnDefs": [
                {"sType": "ticket", "aTargets": [0]}
            ]
        });

    });

</asset:script>
