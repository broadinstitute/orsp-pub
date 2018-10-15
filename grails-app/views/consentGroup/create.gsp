<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<html>
<head>
    <meta name="layout" content="main">
    <title>Create a Consent Group Record</title>
</head>

<body>
<h1>Create a Consent Group Record</h1>

<div class="well col-md-10">

    <g:form id="consentForm"
            name="consentForm"
            controller="consentGroup"
            action="add"
            data-bv-feedbackicons-valid="glyphicon glyphicon-ok"
            data-bv-feedbackicons-invalid="glyphicon glyphicon-remove"
            data-bv-feedbackicons-validating="glyphicon glyphicon-refresh">

        <input type="hidden" name="type" value="${IssueType.CONSENT_GROUP.name}"/>
        <input type="hidden" name="status" value="${IssueStatus.Open.name}"/>
        <input type="hidden" id="summary" name="summary" value=""/>

        <div class="panel panel-default">

            <div class="panel-heading">
                <h3 class="panel-title">Consent Group</h3>
            </div>

            <div class="panel-body">

                <div class="form-group">
                    <label for="consent" class="control-label">Last Name of Investigator Listed on the Consent Form</label>
                    <input
                            type="text"
                            name="consent"
                            value=""
                            id="consent"
                            class="form-control"
                    />
                </div>

                <div class="form-group">
                    <label for="protocol" class="control-label">Collaborating Institution’s Protocol Number</label>
                    <input
                            type="text"
                            name="protocol"
                            value=""
                            id="protocol"
                            class="form-control"
                    />
                </div>

                %{--<div class="form-group">--}%
                    %{--<label for="populationInformation" class="control-label">Population Information</label>--}%
                    %{--<input--}%
                            %{--type="text"--}%
                            %{--name="populationInformation"--}%
                            %{--value=""--}%
                            %{--id="populationInformation"--}%
                            %{--class="form-control"--}%
                    %{--/>--}%
                %{--</div>--}%

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

            </div>

        </div>

        <g:submitButton id="Add" name="Add" value="Add" class="btn btn-primary"/>
        <g:link uri="/" class="btn btn-default"><span class="link-btn">Cancel</span></g:link>

    </g:form>

</div>

</body>
</html>

<asset:script type="text/javascript">
$(document).ready(function() {

    $("#consent,#protocol").on('change', function() {
        $("#summary").val($("#consent").val() + " / " + $("#protocol").val());
    });

    var consentNames = [];
    <g:each in="${consentGroupNames}" var="name">consentNames.push("${name}");</g:each>

    jQuery.validator.addMethod(
        "existingConsentName",
        function(value, element) {
            return $.inArray($("#summary").val(), consentNames) < 0
        },
        "An existing Consent Group with this name exists. Please choose a different name."
    );

    $('#consentForm').validate({
        errorClass: 'invalid',
        errorElement:'div',
        rules: {
            consent: {
                required: true,
                existingConsentName : true
            },
            protocol: {
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


