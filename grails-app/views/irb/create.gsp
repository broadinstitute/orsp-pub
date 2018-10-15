<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>
<%@ page import="org.broadinstitute.orsp.Fields" %>

<!DOCTYPE html>
<head>
    <meta name="layout" content="main">
    <title>New IRB Protocol Record</title>
</head>

<body>
<h1>New IRB Protocol Record</h1>

<div class="well col-md-10" id="add-form">
    <g:form action="add">
        <input type="hidden" name="type" value="${IssueType.IRB.name}"/>
        <input type="hidden" name="status" value="${IssueStatus.PreparingApplication.name}"/>

        <div class="panel panel-default">

            <div class="panel-heading">
                <h3 class="panel-title">Project Information</h3>
            </div>

            <div class="panel-body">

                <div class="form-group">
                    <label for="summary">Broad Project Title</label>
                    <input type="text" name="summary" value="" id="summary" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="expirationDate">Expiration Date</label>
                    <input type="text" name="expirationDate" id="expirationDate" value="" class="datepicker form-control" />
                </div>

                <div class="form-group">
                    <label for="protocol">Protocol #</label>
                    <input type="text" name="protocol" value="" id="protocol" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="description">Brief Project Description</label>

                    <div class="well">
                        <label style="width: 100%;">
                            <textarea id="description" name="description" class="form-control editor"
                                      rows="10"></textarea>
                        </label>
                    </div>
                </div>

            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">People</h3>
            </div>

            <div class="panel-body">

                <div class="form-group">
                    <label for="ignore-pi">Primary Investigator</label>
                    <span class="badge addPrimaryInvestigator"><span class="glyphicon glyphicon-plus"></span></span>
                    <input type="text" value="" id="ignore-pi" name="ignore-pi" class="form-control userAutocomplete"/>
                    <input type="hidden" id="pi-name" name="pi"/>
                </div>

                <div class="form-group" data-child-id="orsp-id12" data-child-value="10054">
                    <label for="affiliations">Primary Investigator Affiliation</label>
                    <span class="property-value">
                        <select multiple
                                name="affiliations"
                                class="chosen-select form-control"
                                id="affiliations"
                                data-placeholder="Choose an affiliation...">
                            <g:each in="${Fields.AFFILIATION_MAP}" var="affiliation">
                                <option value="${affiliation.key}">${affiliation.value}</option>
                            </g:each>
                        </select>
                    </span>
                </div>

                <div class="form-group" id='affiliationOtherGroup'>
                    <label for="affiliationOther">Primary Investigator Other Affiliation</label>
                    <input type="text" name="affiliationOther" value="" size="30" id="affiliationOther"
                           class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="ignore-pm">Project Manager</label>
                    <span class="badge addProjectManager"><span class="glyphicon glyphicon-plus"></span></span>
                    <input type="text" value="" id="ignore-pm" name="ignore-pm" class="form-control userAutocomplete"/>
                    <input type="hidden" name="pm"/>
                </div>

            </div>
        </div>

        <g:render template="/common/editFundingPanel" model="${[fundings: []]}"/>

        <div class="panel panel-default">

            <div class="panel-heading">
                <h3 class="panel-title">IRB</h3>
            </div>

            <div class="panel-body">
                <div class="form-group" data-child-id="" data-child-value="10024">

                    <label for="irb">Preferred Broad IRB</label>

                    <select name="irb"
                            id="irb"
                            class="chosen-select form-control"
                            data-placeholder="Choose an IRB...">
                        <g:each in="${PreferredIrb.values()}" var="irb">
                            <option value="${irb.key}">${irb.label}</option>
                        </g:each>
                    </select>
                </div>

                <div class="form-group">
                    <label for="rationale">Brief rationale for IRB selection (optional)</label>
                    <input type="text" id="rationale" name="rationale" value=""
                           class="form-control"/>
                </div>

            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">dbGAP</h3>
            </div>

            <div class="panel-body">
                <div class="form-group">
                    <p>Will data be submitted to dbGAP?</p>

                    <div class="radio"><label><input type="radio" name="dbgap" value="10009"/> Yes</label></div>

                    <div class="radio"><label><input type="radio" name="dbgap" value="10010"/> No</label></div>

                    <div class="radio"><label><input type="radio" name="dbgap" value="10011"/> Unknown</label></div>

                </div>

                <div class="form-group" id="dbgapYesGroup">
                    <p>If data will be submitted to dbGAP, is Broad responsible for this submission?</p>

                    <div class="radio"><label><input type="radio" name="responsible-id" value="10045"/> Yes</label></div>

                    <div class="radio"><label><input type="radio" name="responsible-id" value="10046"/> No</label></div>

                    <div class="radio"><label><input type="radio" name="responsible-id" value="10047"/> Unknown</label>
                    </div>
                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Review Category</h3>
            </div>
            <div class="panel-body">
                <label for="review-category">Please select a category which best represents this project</label>
                <select name="review-category"
                        id="review-category"
                        class="chosen-select form-control"
                        data-placeholder="Choose a Review Category...">
                        <option value="Expedited">Expedited</option>
                        <option value="Exempt">Exempt</option>
                        <option value="Full">Full</option>
                        <option value="Full">Not Human Subjects</option>
                </select>
            </div>
        </div>

        <g:submitButton id="Add" name="Add" value="Add" class="btn btn-primary" onclick="return validateForm();" />
        <g:link uri="/" class="btn btn-default"><span class="link-btn">Cancel</span></g:link>
    </g:form>
</div>

</body>
</html>

<asset:javascript src="autocompleteUsers.js" asset-defer="true" />

<asset:script type="text/javascript">

    // Register section validation functions here.
    function validateForm() {
        $(".alert").remove();
        let valid1 = validateFunding();
        let valid2 = validateSummary();
        return valid1 && valid2;
    }

    function validateSummary() {
        if (!$("#summary").val()) {
            let errorDiv = $('<div class="col-md-10 alert alert-danger alert-dismissable">Project Title can not be blank</div>');
            $(errorDiv).insertBefore($("#add-form"));
            $('html, body').animate({ scrollTop: 0 }, 500);
            return false;
        }
        return true;
    }

    $(document).ready(function () {
    $('.datepicker').datepicker();
    $("#affiliationOtherGroup").hide();
    $("#affiliations").chosen().change(function (e, params) {
        let selectedValues = $(this).chosen().val() || [];
        if ($.inArray("10054", selectedValues) > -1) {
            $("#affiliationOtherGroup").show();
        } else {
            $("#affiliationOtherGroup").hide();
        }
    });

    $("#dbgapYesGroup").hide();
    $("input[name='dbgap']").on('click', function () {
        if ($(this).val() === "10009") {
            $("#dbgapYesGroup").show();
        } else {
            $("#dbgapYesGroup").hide();
        }
    });

});

</asset:script>
