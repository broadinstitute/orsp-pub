<div class="well">
    <div>
        Copyright © 2019 Eli & Edythe L. Broad Institute. All rights reserved. No unauthorized use or disclosure is permitted.
    </div>
    <div style="margin: 3rem 0 1rem 0;">
        <a href="https://www.broadinstitute.org/contact-us/privacy-policy-broad-institute-website" target="_blank">Privacy Policy</a> |
        <a href="https://www.broadinstitute.org/contact-us/terms-and-conditions" target="_blank">Terms of Service</a>
    </div>
</div>
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
<script src="https://cloud.tinymce.com/5/tinymce.min.js?apiKey=kyknyn3xmeam53u8vyway2oxf18oecyfwkjoym1xcydpyfyh"></script>
<asset:javascript src="jquery.validate.min.js"/>
<asset:javascript src="jsrender.js"/>

<asset:javascript src="jquery.file.upload-9.9.2/js/vendor/jquery.ui.widget.js"/>
<asset:javascript src="jquery.file.upload-9.9.2/js/jquery.iframe-transport.js"/>
<asset:javascript src="jquery.file.upload-9.9.2/js/jquery.fileupload.js"/>

<script type="text/javascript">
    $(document).ready(function () {
        $(".chosen-select").chosen({width: "100%"});
        initializeEditor();
        $('[data-toggle="tooltip"]').tooltip();
    });

    function initializeEditor() {
        tinymce.init({
            selector:'textarea.editor',
            width: '100%',
            menubar: false,
            statusbar: false,
            plugins: "paste",
            paste_data_images: false
        });
    }

    function loadComments(url) {
        $("#comments").load(
                url,
                function() {
                    $.fn.dataTable.moment( 'MM/DD/YYYY hh:mm:ss' );
                    $("#comments-table").DataTable({
                        dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
                        buttons: [ 'excelHtml5', 'csvHtml5', 'print' ],
                        language: { search: 'Filter:' },
                        pagingType: "full_numbers",
                        order: [1, "desc"]
                    });
                    initializeEditor();
                }
        );
    }

    function loadHistory(url) {
        $("#history").load(
                url,
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
    }

    // Toggle pattern for Jira-style objects. Relies on "-id" naming pattern
    function toggleContinueMessage(elementId, val1, val2) {
        $("input[name='" + elementId + "-id'], input[name='" + elementId + "']").change(
            function() {
                if ($(this).val() == val1) {
                    $('*[data-id="' + val1 + '"]').show();
                    $('*[data-id="' + val2 + '"]').hide();
                } else {
                    $('*[data-id="' + val1 + '"]').hide();
                    $('*[data-id="' + val2 + '"]').show();
                }
            }
        );
    }

    // Toggle pattern for property style objects. Slightly different from Jira-style objects.
    function togglePropertyMessage(elementName, val1, val2) {
        $("input[name='" + elementName + "']").change(
            function() {
                prop1Message = $('*[data-id="' + elementName + "." + val1 + '"]');
                prop2Message = $('*[data-id="' + elementName + "." + val2 + '"]');
                if ($(this).val() == val1) {
                    prop1Message.show();
                    prop2Message.hide();
                } else {
                    prop1Message.hide();
                    prop2Message.show();
                }
            }
        );
    }

</script>

<script id="uploadedFileTemplate" type="text/x-jsrender">
<div class="alert alert-success" role="alert" id="{{:fileUuid}}">
    <i class="fa {{:icon}}"></i>
    <span style="padding-left: 10px;">{{:type}}: {{:name}}</span>
    <i class="btn btn-danger fa fa-trash pull-right" onclick="removeDocument('{{:fileUuid}}', '{{:amendmentId}}');"></i>
</div>
</script>

<asset:javascript src="application.js"/>

<g:if test="${tab}">
    <asset:script type="text/javascript">
        $(document).ready(function () {
            $('a[href="#${tab}"]').click();
    });
    </asset:script>
</g:if>
