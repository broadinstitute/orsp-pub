<html>
<head>
    <meta name="layout" content="minimal">
    <title>History</title>
</head>

<body>
<script type="text/javascript">
  $(document).ready(function () {
    console.log("load list en page history vero");
    $("#history").load(
      "https://localhost:8443/dev/api/history?id=ORSP-641",
      function() {
        $.fn.dataTable.moment( 'MM/DD/YYYY hh:mm:ss' );
        $("#history-table").DataTable({
          dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
          buttons: [ 'excelHtml5', 'csvHtml5', 'print' ],
          language: { search: 'Filter:' },
          pagingType: "full_numbers",
          order: [1, "desc"]
        });
      }
    );
  });

</script>
<div class="container col-md-11">
    <table id="history-table" class="table table-bordered table-striped table-condensed table-hover">
        <thead>
            <tr>
                <th>Authorss</th>
                <th>Datejjj</th>
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