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
