<%@ page import="org.broadinstitute.orsp.Fields" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>

<!DOCTYPE html>
<head>
    <meta name="layout" content="main">
    <title>Edit ${issue.type}: ${issue.projectKey}</title>
</head>
<body>

<h1 id="title">Edit ${issue.typeLabel} ${issue.projectKey}</h1>

<div class="well col-md-10" id="edit-form">
    <g:form controller="irb" action="update">
        <g:hiddenField name="id" value="${issue.projectKey}"/>


        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Project Information</h3>
            </div>
            <div class="panel-body">

                <div class="form-group">
                    <label for="summary">Broad Project Title</label>
                    <input type="text" name="summary" value="${issue.summary}" id="summary" class="form-control" />
                </div>

                <div class="form-group">
                    <label for="expirationDate">Expiration Date</label>
                    <input type="text" name="expirationDate" id="expirationDate" value="<g:formatDate date="${issue.expirationDate}" format="MM/dd/yyyy"/>" class="datepicker form-control" />
                </div>

                <div class="form-group">
                    <label for="protocol">Protocol #</label>
                    <input type="text" name="protocol" value="${issue.protocol}" id="protocol" class="form-control" />
                </div>

                <div class="form-group">
                    <span class="property-label">Brief Project Description</span>
                    <div class="well">
                        <label style="width: 100%;">
                            <textarea id="description" name="description" class="form-control editor" rows="10">${issue.description}</textarea>
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
                    <span class="badge addPrimaryInvestigator"> <span class="glyphicon glyphicon-plus"></span></span>
                    <g:if test="${pis.empty}">
                        <input type="text" value="" id="ignore-pi" name="ignore-pi" class="form-control userAutocomplete" />
                        <input type="hidden" name="pi" />
                    </g:if>
                    <g:else>
                        <g:each in="${pis}" var="user" status="index">
                            <div>
                                <%--suppress XmlDuplicatedId --%>
                                <input type="text" value="${user.displayName ?: user.userName}" id="ignore-pi" name="ignore-pi" class="form-control userAutocomplete" />
                                <input type="hidden" name="pi" value="${user.userName}" />
                            </div>
                        </g:each>
                    </g:else>
                </div>

                <div class="form-group"
                     data-child-id="affiliationOtherGroup"
                     data-child-value="10054">

                    <label for="affiliations">PI Affiliation:</label>
                    <select multiple
                            class="chosen-select form-control"
                            name="affiliations"
                            id="affiliations"
                            data-placeholder="Choose an affiliation...">
                        <g:each in="${Fields.AFFILIATION_MAP}" var="affiliation">
                            <g:if test="${issue.affiliations?.contains(affiliation.key)}">
                                <option value="${affiliation.key}" selected="selected">${affiliation.value}</option>
                            </g:if>
                            <g:else>
                                <option value="${affiliation.key}">${affiliation.value}</option>
                            </g:else>
                        </g:each>
                    </select>

                </div>

                <div class="form-group" id="affiliationOtherGroup">
                    <label for="affiliationOther">PI Other Affiliation</label>
                    <input type="text" id="affiliationOther" name="affiliationOther" value="${issue.affiliationOther}" class="form-control" />
                </div>

                <div class="form-group">
                    <label for="ignore-pm">Project Manager</label>
                    <span class="badge addProjectManager"> <span class="glyphicon glyphicon-plus"></span></span>
                    <g:if test="${pms.empty}">
                        <input type="text" value="" id="ignore-pm" name="ignore-pm" class="form-control userAutocomplete" />
                        <input type="hidden" name="pm" />
                    </g:if>
                    <g:else>
                        <g:each in="${pms}" var="user" status="index">
                            <div>
                                <%--suppress XmlDuplicatedId --%>
                                <input type="text" value="${user.displayName ?: user.userName}" id="ignore-pm" name="ignore-pm" class="form-control userAutocomplete" />
                                <input type="hidden" name="pm" value="${user.userName}" />
                            </div>
                        </g:each>
                    </g:else>
                </div>

            </div>
        </div>

        <g:render template="/common/editFundingPanel" model="${[fundings: issue.fundings]}"/>

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
                            <g:if test="${issue.irb?.equals(irb.key)}">
                                <option value="${irb.key}" selected="selected">${irb.label}</option>
                            </g:if>
                            <g:else>
                                <option value="${irb.key}">${irb.label}</option>
                            </g:else>
                        </g:each>
                    </select>
                </div>

                <div class="form-group">
                    <label for="rationale">Brief rationale for IRB selection (optional)</label>
                    <input type="text" id="rationale" name="rationale" value="${issue.rationale}" class="form-control"/>
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
                    <div class="radio"><label><input type="radio" name="dbgap" <g:if test="${issue.dbgap == "10009"}">checked="checked"</g:if> value="10009" /> Yes</label></div>
                    <div class="radio"><label><input type="radio" name="dbgap" <g:if test="${issue.dbgap == "10010"}">checked="checked"</g:if> value="10010" /> No</label></div>
                    <div class="radio"> <label><input type="radio" name="dbgap" <g:if test="${issue.dbgap == "10011"}">checked="checked"</g:if> value="10011" /> Unknown</label></div>

                </div>

                <div class="form-group" id="dbgapYesGroup">
                    <p>If data will be submitted to dbGAP, is Broad responsible for this submission?</p>
                    <div class="radio"><label><input type="radio" name="responsible" <g:if test="${issue.responsible == "10045"}">checked="checked"</g:if> value="10045" /> Yes</label></div>
                    <div class="radio"><label><input type="radio" name="responsible" <g:if test="${issue.responsible == "10046"}">checked="checked"</g:if> value="10046" /> No</label></div>
                    <div class="radio"><label><input type="radio" name="responsible" <g:if test="${issue.responsible == "10047"}">checked="checked"</g:if> checked="checked" value="10047" /> Unknown</label></div>

                </div>
            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Review Category</h3>
            </div>
            <div class="panel-body">
                Please select a category which best represents this project:
                <select name="review-category"
                        id="review-category"
                        class="chosen-select form-control"
                        data-placeholder="Choose a Review Category...">
                    <option value="Expedited" <g:if test="${issue.reviewCategory?.equals("Expedited")}">selected="selected"</g:if>>Expedited</option>
                    <option value="Exempt" <g:if test="${issue.reviewCategory?.equals("Exempt")}">selected="selected"</g:if>>Exempt</option>
                    <option value="Full" <g:if test="${issue.reviewCategory?.equals("Full")}">selected="selected"</g:if>>Full</option>
                    <option value="Not Human Subjects" <g:if test="${extraProperties?.find{it.name.equals("review-category")}?.value?.equals("Not Human Subjects")}">selected="selected"</g:if>>Not Human Subjects</option>
                </select>
            </div>
        </div>

        <g:actionSubmit class="btn btn-primary" action="update" value="Update" onclick="return validateForm();" />

        <g:link class="cancel btn btn-default" action="show" id="${issue.projectKey}"><span class="link-btn">Cancel</span></g:link>

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
            $(errorDiv).insertBefore($("#edit-form"));
            $('html, body').animate({ scrollTop: 0 }, 500);
            return false;
        }
        return true;
    }

    $(document).ready(function () {
        $('.datepicker').datepicker();
        //noinspection JSJQueryEfficiency
        $("#affiliationOtherGroup").hide();
        //noinspection JSJQueryEfficiency
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

        // Handle the case of previously selected options:
        $("input[name='dbgap']:checked").click();
        //noinspection JSJQueryEfficiency
        if ($.inArray("10054", $("#affiliations").chosen().val()) > -1) {
            $("#affiliationOtherGroup").show();
        } else {
            $("#affiliationOtherGroup").hide();
        }

    });

</asset:script>

