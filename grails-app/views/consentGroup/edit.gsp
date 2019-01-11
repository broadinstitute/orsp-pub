<html>
<head>
    <meta name="layout" content="main">
    <title>Edit ${issue.type}: ${issue.projectKey}</title>
</head>

<body>
<h1>Edit ${issue.type}: ${issue.projectKey}</h1>

<div class="well col-md-10">

    <g:form name="consentForm">

        <input type="hidden" name="id" value="${issue.projectKey}"/>

        <div class="panel panel-default">

            <div class="panel-heading">
                <h3 class="panel-title">Consent Group</h3>
            </div>

            <div class="panel-body">

                <div class="form-group">
                    <label for="summary">Consent Group Name</label>
                    <input type="text" name="summary" value="${issue.summary}" id="summary" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="consent">Last Name of Investigator Listed on the Consent Form</label>
                    <input type="text" name="consent" value="${issue.consent}" id="consent" class="form-control""/>
                </div>

                <div class="form-group">
                    <label for="protocol">Collaborating Institution’s Protocol Number</label>
                    <input type="text" name="protocol" value="${issue.protocol}" id="protocol" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="collInst">Collaborating Institution</label>
                    <input type="text" name="collInst" value="${issue.collInst}" id="collInst" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="collContact">Primary Contact at Collaborating Institution (not required)</label>
                    <input type="text" name="collContact" value="${issue.collContact}" id="collContact" class="form-control"/>
                </div>

            </div>

        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">BSP Collections</h3>
            </div>
            <g:if test="${collectionLinks}">
                <table class="table table-bordered table-hover">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>Name</th>
                        <th>Category</th>
                        <th>Group</th>
                        <th>Linked Project</th>
                    </tr>
                    </thead>
                    <tbody>
                    <g:each in="${collectionLinks}" var="link" status="index">
                        <tr>
                            <td>${link.sampleCollection?.collectionId}</td>
                            <td>${link.sampleCollection?.name}</td>
                            <td>${link.sampleCollection?.category}</td>
                            <td>${link.sampleCollection?.groupName}</td>
                            <td>
                                <a href="${createLink(controller: link.linkedProject.controller, action: 'show', params: [id: link.linkedProject.projectKey])}">
                                    ${link.linkedProject.projectKey}: ${link.linkedProject.summary}
                                </a>
                            </td>
                        </tr>
                    </g:each>
                    </tbody>
                </table>
            </g:if>
            <g:else>
                <ul class="list-group">
                    <li class="list-group-item">No BSP sample collections associated to this consent group.</li>
                </ul>
            </g:else>

        </div>

        <g:actionSubmit class="btn btn-default" action="update" value="Update"/>
        <g:link class="cancel btn btn-default" action="show" id="${issue.projectKey}"><span class="link-btn">Cancel</span></g:link>

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
            return $.inArray(value, consentNames) < 0
        },
        "An existing Consent Group with this name exists. Please choose a different name."
    );

    $('#consentForm').validate({
        errorClass: 'invalid',
        errorElement:'div',
        rules: {
            summary: {
                required: true,
                existingConsentName: true
            },
            consent: "required",
            collInst: "required"
        },
        messages: {
            summary: {
                required: "Consent Group Name is required",
                existingConsentName: "An existing Consent Group with this name exists. Please choose a different name."
            },
            consent: {
                required: "Investigator Name on Consent is required"
            },
            collInst: {
                required: "Collaborating Institution is required"
            }
        }
    });

});

</asset:script>


