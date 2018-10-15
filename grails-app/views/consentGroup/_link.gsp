%{--

This template requires the following arguments:

issue

--}%

<g:form id="linkConsentForm"
        name="linkConsentForm"
        controller="consentGroup"
        action="link"
        data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
        data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
        data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

    <div class="modal-header panel-heading">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span
                class="sr-only">Close</span></button>
        <h4 class="modal-title">Link ${issue.projectKey}: ${issue.summary} to Consent Group</h4>
    </div>

    <div class="modal-body">

        %{-- This source is for the project to which the new consent group will be linked --}%
        <input type="hidden" id="source" name="source" value="${issue.projectKey}"/>

        <div class="form-group">
            <label for="consentGroupKey" class="control-label">Consent Group</label>
            <select
                    name="consentGroupKey"
                    id="consentGroupKey"
                    class="form-control chosen-select"
                    data-placeholder="Choose a consent group...">
            </select>
        </div>

        <div class="form-group">
            <label for="selectedSamples">Select Samples to Link to ${issue.projectKey}</label>
            <select multiple
                    name="selectedSamples"
                    id="selectedSamples"
                    class="form-control chosen-select"
                    data-placeholder="Choose a sample collection ...">
            </select>
        </div>

    </div>

    <div class="modal-footer">
        <button type="button" class="btn btn-default" data-dismiss="modal">Close</button>
        <g:submitButton id="Add" name="Add" value="Add" class="btn btn-primary"/>
    </div>
</g:form>

<asset:script type="text/javascript">
    $(document).ready(function () {
        let unConsentedSamples = [];
        $.getJSON(
            "${createLink(controller: 'consentGroup', action: 'getConsentGroups')}",
            function(data) {
                $.each(data, function(index, element){
                    $("#consentGroupKey").append('<option value="' + element.id + '">' + element.label + '</option>');
                });
                if ($(data).size() > 0) {
                    $("#consentGroupKey").trigger("chosen:updated").trigger('change');
                }
            }
        );

        $("#consentGroupKey").on('change', function() {
            let consentedGroup = $('<optgroup />', { label: "Sample Collections Linked to " + $("#consentGroupKey").chosen().val()});
            if (unConsentedSamples.length == 0) {
                $.getJSON(
                    "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
                    function(data) {
                        $.each(data, function(index, element) {
                            unConsentedSamples.push( $('<option/>', {value: element.collectionId, text: element.collectionId + ": " + element.name + " ( " + element.category + " )" } ) );
                        });
                    }
                ).done(function() {
                    $.getJSON(
                        "${createLink(controller: 'consentGroup', action: 'getConsentGroupSampleCollections')}",
                        { consentKey: $("#consentGroupKey").chosen().val() },
                        function(data) {
                            $.each(data, function(index, element) {
                                consentedGroup.append(
                                    $('<option/>', {
                                        value: element.collectionId,
                                        text : element.collectionId + ': ' + element.name + ' ( ' + element.category + ' )'}));
                            });
                            const unConsentedGroup = $('<optgroup />', { label: "Link New Sample Collections to Consent Group: " + $("#consentGroupKey").chosen().val()}).append(unConsentedSamples);
                            $("#selectedSamples").
                                empty().
                                append(consentedGroup).
                                append(unConsentedGroup).
                                trigger("chosen:updated");
                            $("li.search-field, input[type=text].default").css({width: "100%"});
                        }
                    );
                });
            } else {
                $.getJSON(
                    "${createLink(controller: 'consentGroup', action: 'getConsentGroupSampleCollections')}",
                    { consentKey: $("#consentGroupKey").chosen().val() },
                    function(data) {
                        $.each(data, function(index, element) {
                            consentedGroup.append(
                                $('<option/>', {
                                    value: element.collectionId,
                                    text : element.collectionId + ': ' + element.name + ' ( ' + element.category + ' )'}));
                        });
                        const unConsentedGroup = $('<optgroup />', { label: "Link New Sample Collections to Consent Group: " + $("#consentGroupKey").chosen().val()}).append(unConsentedSamples);
                        $("#selectedSamples").
                            empty().
                            append(consentedGroup).
                            append(unConsentedGroup).
                            trigger("chosen:updated");
                        $("li.search-field, input[type=text].default").css({width: "100%"});
                    }
                );
            }
        });

        $('#linkConsentForm').validate({
            errorClass: 'invalid',
            errorElement:'div',
            rules: {
                consentGroupKey: "required"
            },
            messages: {
                consentGroupKey: {
                    required: "Consent Group is required"
                }
            }
        });

    });
</asset:script>
