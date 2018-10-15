%{--

This template requires the following arguments:

issue

--}%

<g:form id="createAndLinkConsentForm"
        name="createAndLinkConsentForm"
        controller="consentGroup"
        action="createAndLink"
        data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
        data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
        data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

    <div class="modal-header panel-heading">
        <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
        <h4 class="modal-title">Create Consent Group Linked to ${issue.projectKey}: ${issue.summary}</h4>
    </div>

    <div class="modal-body">

        %{-- This source is for the project to which the new consent group will be linked --}%
        <input type="hidden" id="source" name="source" value="${issue.projectKey}"/>

        <div class="form-group">
            <label for="consentLastName" class="control-label">Last Name of Investigator Listed on the Consent Form</label>
            <input
                    type="text"
                    name="consent"
                    value=""
                    id="consentLastName"
                    class="form-control"
            />
        </div>

        <div class="form-group">
            <label for="createProtocol" class="control-label">Collaborating Institution’s Protocol Number</label>
            <input
                    type="text"
                    name="protocol"
                    value=""
                    id="createProtocol"
                    class="form-control"
            />
        </div>

        <div class="form-group">
            <label for="createSummary" class="control-label">Consent Group Name</label>
            <input
                    type="text"
                    name="summary"
                    value=""
                    id="createSummary"
                    class="form-control"
                    readonly
            />
        </div>

        <div class="form-group">
            <label for="collInst" class="control-label">Collaborating Institution</label>
            <input
                    type="text"
                    name="collInst"
                    value=""
                    id="collInst"
                    class="form-control"
            />
        </div>

        <div class="form-group">
            <label for="collContact" class="control-label">Primary Contact at Collaborating Institution (not required)</label>
            <input
                    type="text"
                    name="collContact"
                    value=""
                    id="collContact"
                    class="form-control"
            />
        </div>

        <div class="form-group">
            <label for="newSamples">Link Sample Collections to ${issue.projectKey}</label>
            <select multiple
                    name="newSamples"
                    id="newSamples"
                    class="form-control chosen-select new-samples"
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
            "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
                function(data) {
                    $.each(data, function(index, element) {
                        unConsentedSamples.push( $('<option/>', {value: element.collectionId, text: element.collectionId + ": " + element.name + " ( " + element.category + " )" } ) );
                    });
                    $("#newSamples").
                        empty().
                        append(unConsentedSamples).
                        trigger("chosen:updated");

                    console.log("Added unconsented samples to select");
                 }
            );

                $("#consentLastName,#createProtocol").on('change', function() {
            $("#createSummary").val($("#consentLastName").val() + " / " + $("#createProtocol").val());
        });

        let consentNames = [];
        $.getJSON(
            "${createLink(controller: 'consentGroup', action: 'consentGroupSummaries')}",
            function(data) {
                $.each(data, function(index, element){
                    consentNames.push(element);
                });
            }
        );

        jQuery.validator.addMethod(
            "existingConsentName",
            function(value, element) {
                return $.inArray($("#createSummary").val(), consentNames) < 0
            },
            "An existing Consent Group with this name exists. Please choose a different name."
        );

        $('#createAndLinkConsentForm').validate({
            errorClass: 'invalid',
            errorElement:'div',
            rules: {
                consent: {
                    required: true,
                    existingConsentName : true
                },
                protocol: {
                    required: true,
                    existingConsentName : true
                },
                collInst: "required"
            },
            messages: {
                consent: {
                    required: "Investigator Name on Consent is required",
                    existingConsentName: "An existing Consent Group with this investigator name exists. Please choose a different one."
                },
                protocol: {
                    existingConsentName: "An existing Consent Group with this protocol exists. Please choose a different one."
                },
                collInst: {
                    required: "Collaborating Institution is required"
                }
            }
        });

    });
</asset:script>