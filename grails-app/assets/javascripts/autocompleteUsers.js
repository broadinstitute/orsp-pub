$(document).ready(function () {

    applyUserAutocomplete();
    $("span.addProjectManager").
        css({"cursor": "pointer"}).
        on('click',
            function () {
                var input = $('<input type="text" class="userAutocomplete form-control" name="ignore-pm" /><input type="hidden" name="pm" />');
                $(this).parent().append(input);
                applyUserAutocomplete();
                $("input[name='ignore-pm']").last().focus();
            });

    $("span.addPrimaryInvestigator").
        css({"cursor": "pointer"}).
        on('click',
            function () {
                var input = $('<input type="text" class="userAutocomplete form-control" name="ignore-pi" /><input type="hidden" name="pi" />');
                $(this).parent().append(input);
                applyUserAutocomplete();
                $("input[name='ignore-pi']").last().focus();
            });

});

/**
 * The User autocomplete needs two input fields, one for showing the user the full display name and one for passing the
 * user's Broad username as an id for a user. This works in conjunction with the document.ready above so that the hidden
 * text field is adjacent to the autocomplete text field and the two work in tandem.
 */
function applyUserAutocomplete() {
    $(".userAutocomplete").
        autocomplete({
            source: window.appContext + "/search/getMatchingUsers",
            minLength: 2,
            change: function (event, ui) {
                // This implements a "must-match" constraint on both the displayed autocomplete and the passed hidden
                // field value
                if (!ui.item) {
                    $(this).val('');
                    $(this).next().val('');
                }
            },
            select: function(e, ui) {
                // Update the hidden text field value. This is the real value used by the server.
                $(this).next().val(ui.item.id);
            }
        });
}
