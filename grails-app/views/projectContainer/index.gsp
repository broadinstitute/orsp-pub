<g:javascript>
    const projectReviewValues = {
     
    };

    const urls = {
        saveExtraPropUrl: "${createLink(controller: 'project', action: 'modifyExtraProperties')}"
    };
</g:javascript>

<html>

<head>
  <meta name="layout" content="main">
  <meta name="layout" content="minimal">
  <meta name="layout" content="main_component">


%{-- Set context path for all scripts to use --}%
<script type="text/javascript">
    window.appContext = '${request.contextPath}';
</script>
%{-- Uncomment for debugging jquery --}%
%{--<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.js"></script>--}%
<script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
<script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
<script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>

%{--
    New DataTables update. Note that there are many existing datatables code that do not make use of the newer format.
    See statusEvent/index.gsp and views/issueList.gsp for how to use the format.
--}%
<script src="//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.5.1/js/dataTables.buttons.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.5.1/js/buttons.flash.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
<script src="//cdn.datatables.net/buttons/1.5.1/js/buttons.html5.min.js"></script>
<script src="//cdn.datatables.net/buttons/1.5.1/js/buttons.print.min.js"></script>
<script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js"></script>
<script src="//cdn.datatables.net/plug-ins/1.10.19/sorting/datetime-moment.js"></script>
%{-- End new data tables code --}%

<asset:javascript src="jquery.fn.dataTablesExt.ticket.js"/>
<asset:javascript src="jquery.fn.dataTablesExt.ticket.js"/>
<asset:javascript src="chosen.jquery.min.js"/>
<asset:javascript src="jasny-bootstrap.min.js"/>
<script src="https://cloud.tinymce.com/5/tinymce.min.js?apiKey=8zknubfnjvv9l3sg0cpxrome1qk6r2wlpdw7j4ebb3gjxige"></script>
<asset:javascript src="jquery.validate.min.js"/>
<asset:javascript src="jsrender.js"/>

<asset:javascript src="jquery.file.upload-9.9.2/js/vendor/jquery.ui.widget.js"/>
<asset:javascript src="jquery.file.upload-9.9.2/js/jquery.iframe-transport.js"/>
<asset:javascript src="jquery.file.upload-9.9.2/js/jquery.fileupload.js"/>


  <title>Project Container</title>
</head>

<body>
  <div id="projectContainer"></div>
  <asset:javascript src="build/projectContainer.js"/>
</body>
</html>