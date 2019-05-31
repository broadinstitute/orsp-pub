%{--
This template requires the following arguments:

[
    issue: Issue
    groupedSubmissions: Submissions, grouped by type
]

--}%

<div id="submission-tabs">
    %{-- Using status for anchor links since types could be problematic --}%
    <g:set var="keySet" value="${groupedSubmissions.keySet()}"/>
    <ul>
        <g:each in="${keySet}" var="type" status="i">
            <li>
                <a href="#tab_${i}" style="cursor: pointer;">${type}
                    <g:if test="${groupedSubmissions.get(type).size() > 0}">
                        <span class="badge badge-dark" style="margin-left: 1em;">${groupedSubmissions.get(type).size()}</span>
                    </g:if>
                </a>
            </li>
        </g:each>
    </ul>

    <g:each in="${keySet}" var="type" status="i">
        <div id="tab_${i}">
            %{-- Submission creation/editing is restricted to ORSP --}%
            <auth:isOrsp>
                <div class="pull-right">
                    <a class="btn btn-default link-btn"
                       onclick='document.location="${createLink(controller: 'submission', action: 'index', params: [projectKey: issue.projectKey, type: type])}"'>Add Submission</a>
                </div>
            </auth:isOrsp>
            <table class="submissionTable table table-striped table-bordered">
                <thead>
                <tr>
                    <th>Number</th>
                    <th style="max-width: 400px;">Description</th>
                    <th>Documents</th>
                    <th>Created</th>
                </tr>
                </thead>
                <tbody>

                <g:each in="${groupedSubmissions.get(type)}" var="submission">
                    <tr>
                        <td>${submission.number}</td>
                        <td style="max-width: 400px;">
                            <a href="${createLink(controller: 'submission', action: 'index', params: [projectKey: issue.projectKey, submissionId: submission.id])}"
                               class="btn btn-default btn-xs pull-left link-btn"
                               style="margin: 5px 10px 5px 5px;">
                                <auth:isOrsp>
                                    Edit
                                </auth:isOrsp>
                                <auth:isNotOrsp>
                                    View
                                </auth:isNotOrsp>
                            </a>
                            ${raw(submission.comments)}
                        </td>
                        <td>
                            <g:each in="${submission.documents}" var="document">
                            <a href="${createLink(controller: 'authenticated', action: 'downloadDocument', params: [uuid: document.uuid])}"
                               data-toggle="tooltip"
                               data-placement="top"
                               title="${document.fileType}">
                                <span class="glyphicon glyphicon-download">&nbsp;</span>${document.fileName}</a>
                                <br/>
                            </g:each>
                        </td>
                        <td><g:formatDate date="${submission.createDate}" format="MM/dd/yyyy"/></td>
                    </tr>
                </g:each>

                </tbody>
            </table>
        </div>
    </g:each>
</div>
<asset:script type="text/javascript">
    $(document).ready(function() {
        $.fn.dataTable.moment( 'M/D/YYYY' );
        $(".submissionTable").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [],
            language: { search: 'Filter:' },
            pagingType: "full_numbers",
            pageLength: 50,
            columnDefs: [ { targets: [1, 2], orderable: false} ],
            order: [0, "desc"]
        });
        $("#submission-tabs").tabs();
    });
</asset:script>
