export const loadHistory = () => {
  $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
  $("#history-table").DataTable({
    dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
    buttons: ['excelHtml5', 'csvHtml5', 'print'],
    language: { search: 'Filter:' },
    pagingType: "full_numbers",
    order: [1, "desc"]
  });
}

export const loadSubmissions = () => {
  $(".submissionTable").DataTable({
    dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
    buttons: [],
    language: { search: 'Filter:' },
    pagingType: "full_numbers",
    pageLength: 50,
    columnDefs: [{ targets: [1, 2], orderable: false }],
    order: [0, "desc"]
  });
  $("#submission-tabs").tabs();
}

export const loadConsentGroups = () => {
  $('.consent-group-panel-body').hide();
  $('.consent-accordion-toggle').on('click', function () {
    var icon = $(this).children().first();
    var body = $(this).parent().parent().next();
    if (icon.hasClass("glyphicon-chevron-up")) {
      icon.removeClass("glyphicon-chevron-up").addClass("glyphicon-chevron-down");
      body.slideUp();
    } else {
      icon.removeClass("glyphicon-chevron-down").addClass("glyphicon-chevron-up");
      body.show("slow");
    }
  });
  $(".modal-add-button").on('click', function () {
    $("#add-consent-document-modal").load(
      "${createLink(controller: 'consentGroup', action: 'loadModalWindow')}",
      {
        issueKey: $(this).data("issue"),
        consentKey: $(this).data("consent"),
        controller: "${issue.controller}"
      },
      function () {
        $(".chosen-select").chosen({ width: "100%" }).trigger("chosen:updated");
        $("button[data-dismiss='modal']").on("click", function () { $("#add-consent-document-modal").dialog("close"); });
      }
    ).dialog({
      modal: true,
      minWidth: 1000,
      minHeight: 500,
      closeOnEscape: true,
      hide: { effect: "fadeOut", duration: 300 },
      show: { effect: "fadeIn", duration: 300 }
    }).parent().removeClass("ui-widget-content");
  });
}

export const loadComments = () => {
  tinymce.remove();
  $.fn.dataTable.moment('MM/DD/YYYY hh:mm:ss');
  $("#comments-table").DataTable({
    dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
    buttons: ['excelHtml5', 'csvHtml5', 'print'],
    language: { search: 'Filter:' },
    pagingType: "full_numbers",
    order: [1, "desc"]
  });

  initializeEditor();
}

function initializeEditor() {
  tinymce.init({
    selector: 'textarea.editor',
    width: '100%',
    menubar: false,
    statusbar: false,
    plugins: "paste",
    paste_data_images: false
  });

}
