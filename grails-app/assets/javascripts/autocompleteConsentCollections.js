$(document).ready(function () {

    applyCollectionsAutocomplete();
    $("span.addBspCollection").
        css({"cursor": "pointer"}).
        on('click',
        function () {
            var input = $('<input type="text" class="collectionsAutocomplete form-control" name="collections" />');
            $(this).parent().append(input);
            applyCollectionsAutocomplete();
            $(".collectionsAutocomplete").last().focus();
        });
});

function applyCollectionsAutocomplete() {
    $(".collectionsAutocomplete").
        autocomplete({
            source: window.appContext + "/search/getMatchingCollections",
            minLength: 2,
            change: function (event, ui) {
                // This implements a "must-match" constraint on the autocomplete
                if (!ui.item) { $(this).val(''); }
            }
        });
}