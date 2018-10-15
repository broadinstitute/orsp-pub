<div class="row panel panel-default">
    <div class="panel-heading">
        ${header}
        (<a href="${createLink(controller: 'issueList', action: 'list', params: [assignee: assignee, header: header])}">show all</a>)
    </div>

    <div class="panel-body">
        <table id="${id}Projects" class="table table-hover table-bordered">
            <thead>
            <tr>
                <th title="Project">Project</th>
                <th title="Title">Title</th>
                <th title="Title">Status</th>
                <th>Type</th>
                <th>Updated</th>
                <th>Expiration</th>
            </tr>
            </thead>
            <tbody>
            </tbody>
        </table>
    </div>
</div>

<asset:script type="text/javascript">
    $(document).ready(function () {
    $.fn.dataTable.moment( 'M/D/YYYY' );
        $("#${id}Projects").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [],
            order: [[ 4, "desc" ]],
            paging: false,
            language: { search: 'Filter:' },
            ajax: {
                url: "${createLink(controller: 'issueList', action: 'issueItems', params: [max: 5, assignee: assignee])}",
                type: "GET"
            },
            columnDefs: [ { targets: [0], type: "ticket"} ]
        });
    });
</asset:script>
