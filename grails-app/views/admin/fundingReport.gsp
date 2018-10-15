<html>
<head>
    <meta name="layout" content="main">
    <title>Funding Source Report</title>
</head>

<body>

<h1>Funding Source Report</h1>

<div class="container" style="width: 100%;">

    <table id="fundingSources" class="table table-bordered table-striped">
        <thead>
            <tr>
                <th>Issue Type</th>
                <th>Project Key</th>
                <th>Title</th>
                <th>Status</th>
                <th>Protocol</th>
                <th>PIs</th>
                <th>Funding Source</th>
                <th>Funding Name</th>
                <th>Funding Award Number</th>
            </tr>
        </thead>
    </table>

</div>
</body>
</html>

<asset:script type="text/javascript">

    %{--
        See:
            https://datatables.net/examples/data_sources/server_side.html
            https://datatables.net/manual/server-side
        --}%

    $(document).ready(function(){
        $("#fundingSources").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [ 'excelHtml5', 'csvHtml5', 'print' ],
            processing: true,
            serverSide: true,
            ajax: {
                url: "${createLink([controller: "report", action: "funding"])}",
                type: "POST"
            },
            language: { search: 'Filter:' },
            pagingType: "full_numbers",
            pageLength: 500,
            columnDefs: [ { targets: [1], type: "ticket"},
                          { targets: [4, 5], orderable: false}]
        });
    });

</asset:script>