<%@ page import="org.broadinstitute.orsp.Fields" %>
<html>
<head>
    <meta name="layout" content="main">
    <title>Edit ${issue.type}: ${issue.projectKey}</title>
</head>

<body>
<h1>Edit ${issue.type}: ${issue.projectKey}</h1>

<div class="well col-md-10" id="edit-form">
<g:form  controller="nhsr" action="update">

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
                <label for="requestDate">Date of Request</label>
                <input type="text" id="requestDate" disabled value="<g:formatDate date="${issue.requestDate}" type="datetime" style="MEDIUM"/>" class="form-control" />
            </div>

            <div class="form-group">
                <label for="ignore-pi">Broad Investigator (if applicable)</label>
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

            <div class="form-group">
                <label for="source">Sample/Data Provider, and Organizational Affiliation</label>
                <input class="form-control" type="text" name="source" value="${issue.source}" id="source"/>
            </div>

        </div>

    </div>

    <g:render template="/common/editFundingPanel" model="${[fundings: issue.fundings]}"/>

    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title">Submission Type</h3>
        </div>

        <div class="panel-body">
            <div class="form-group">
                <p>
                    Is this an 'Initial Determination Request', or a 'Clarification Request', to ascertain whether a
                    change in the project (e.g. new cohort, change in technology) affects a previous determination?
                </p>
                <g:each in="${Fields.SUBMISSION_TYPE_MAP}" var="type">
                    <div class="radio">
                        <label>
                            <input type="radio"
                                   name="submissionType"
                                   <g:if test="${issue.submissionType == type.key}">checked="checked"</g:if>
                                   value="${type.key}" />
                            ${type.value}
                        </label>
                    </div>
                </g:each>
            </div>
        </div>

    </div>


    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title">Are Project Activities Research?</h3>
        </div>

        <div class="panel-body">
            <div class="form-group">

                <p>
                    Is the activity a "systematic investigation designed to develop or contribute to
                    <strong>generalizable knowledge</strong>"? [Examples of activities that might not result in
                    generalizable knowledge include: single case studies and internal technology development/feasibility
                    projects (not intended for external adoption or use).]
                </p>

                <div class="radio"><label><input type="radio" name="research" <g:if test="${issue.research == '10069'}">checked="checked"</g:if> value="10069" /> Yes</label></div>
                <div class="radio"><label><input type="radio" name="research" <g:if test="${issue.research == '10070'}">checked="checked"</g:if> value="10070" /> No</label></div>

                <div class="radio-message alert alert-info" data-id="10069">Please continue to the next field.</div>

                <div class="radio-message alert alert-info" data-id="10070">
                    This project is eligible for a "not research" determination.  Please skip to the 'Project Description'.
                </div>

            </div>
        </div>
    </div>


    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title">Does the Research Involve Human Subjects?</h3>
        </div>

        <div class="panel-body">

            <div class="form-group">
                <p>Does the project involve samples/cell lines that are <strong>all</strong> commercially available?</p>

                <div class="radio"><label><input type="radio" name="commercially-available" <g:if test="${extraProperties?.find{it.name.equals("commercially-available")}?.value?.equals("Yes")}">checked="checked"</g:if> value="Yes"/> Yes</label></div>

                <div class="radio"><label><input type="radio" name="commercially-available" <g:if test="${extraProperties?.find{it.name.equals("commercially-available")}?.value?.equals("No")}">checked="checked"</g:if> value="No"/> No</label></div>

                <div class="radio-message alert alert-info" data-id="commercially-available.Yes">
                    This project is eligible for a "not human subjects research" determination. Please skip to the
                    'Project Description'.
                </div>

                <div class="radio-message alert alert-info" data-id="commercially-available.No">Please continue to the next field.</div>

            </div>

            <div class="form-group">
                <p>
                    Are <strong>all</strong> the subjects who provided samples/data now deceased?
                </p>

                <div class="radio"><label><input type="radio" name="deceased" <g:if test="${issue.deceased == '10102'}">checked="checked"</g:if> value="10102" /> Yes</label></div>
                <div class="radio"><label><input type="radio" name="deceased" <g:if test="${issue.deceased == '10103'}">checked="checked"</g:if> value="10103" /> No/Unknown</label></div>

                <div class="radio-message alert alert-info" data-id="10103">Please continue to the next field.</div>
                <div class="radio-message alert alert-info" data-id="10102">
                    This project is eligible for a "not human subjects research" determination. Please skip to the
                    'Project Description'.
                </div>
            </div>

            <div class="form-group">
                <p>
                    Is a Broad staff member/affiliate either
                    a) <strong>obtaining information/biospecimens through an intervention or interaction with an individual,
                    and using, studying or analyzing the information/biospecimens</strong>, or
                    b) <strong>obtaining, using, studying, analyzing, or generating identifiable private information/biospecimens</strong>?
                    (Note that coded data/biospecimens are considered identifiable if the researcher or anyone on the study team has access to a
                    key that would allow linkage to private identifiable information.)
                </p>

                <div class="radio"><label><input type="radio" name="identifiable" <g:if test="${issue.identifiable == '10106'}">checked="checked"</g:if> value="10106" /> Yes</label></div>
                <div class="radio"><label><input type="radio" name="identifiable" <g:if test="${issue.identifiable == '10107'}">checked="checked"</g:if> value="10107" /> No</label></div>

                <div class="radio-message alert alert-danger" data-id="10106">
                    STOP here. This project falls under a different regulatory category.
                    <strong>Please contact ORSP.</strong>
                </div>
                <div class="radio-message alert alert-info" data-id="10107">Please continue to the next field.</div>
            </div>


            <div class="form-group">
                <p>
                    Are samples or data being <strong>provided to the Broad by an investigator who has access to
                    private identifiable information/biospecimens?</strong>
                </p>

                <div class="radio"><label><input type="radio" name="collHasIdentity" <g:if test="${issue.collHasIdentity == '10126'}">checked="checked"</g:if> value="10126" /> Yes</label></div>
                <div class="radio"><label><input type="radio" name="collHasIdentity" <g:if test="${issue.collHasIdentity == '10127'}">checked="checked"</g:if> value="10127" /> No</label></div>

                <div class="radio-message alert alert-info" data-id="10126">Please continue to the next field.</div>
                <div class="radio-message alert alert-info" data-id="10127">
                    This project is eligible for a "not human subjects research" determination. Please skip to the 'Project Description'.
                </div>
            </div>


            <div class="form-group">
                <p>
                    Is the Broad researcher <strong>co-publishing or doing joint analysis</strong> with an investigator
                    who has access to private identifiable information/biospecimens?
                </p>

                <div class="radio"><label><input type="radio" name="collPublication" <g:if test="${issue.collPublication == 'Yes'}">checked="checked"</g:if> value="10028" /> Yes</label></div>
                <div class="radio"><label><input type="radio" name="collPublication" <g:if test="${issue.collPublication == 'No'}">checked="checked"</g:if> value="10029" /> No</label></div>

                <div class="radio-message alert alert-danger" data-id="10028">
                    STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                </div>
                <div class="radio-message alert alert-info" data-id="10029">Please continue to the next field.</div>
            </div>

        </div>

    </div>


    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Project Description</h3>
        </div>

        <div class="panel-body">
            <div class="form-group">
                <p>
                    Provide a brief (1-2 paragraphs) description of this project. Include the purpose, relevant
                    background information, research activities, and the type of data/biological samples to be studied.
                    If using established cell lines, describe their origin, and whether or not they are publicly
                    available to the scientific community. Submit copies of any sample collection consent forms. If
                    these are not available, describe why this is the case (proprietary, waiver of consent,
                    commercially purchased, etc).
                </p>
                <div class="well">
                    <label style="width: 100%;">
                        <textarea name="description" class="form-control editor" rows="10">${issue.description}</textarea>
                    </label>
                </div>
            </div>
        </div>
    </div>


    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">Broad Data Sharing Plans</h3>
        </div>

        <div class="panel-body">
            <div class="form-group">
                <p>
                    Are there plans for the Broad to deposit data from this project into a public or controlled access data
                    repository (e.g. dbGaP), due to either a) use of federal funding or b) possible future publication
                    requirements?
                </p>

                <div class="radio"><label><input type="radio" name="dataSharingBroad" <g:if test="${issue.dataSharingBroad == '10203'}">checked="checked"</g:if> value="10203"/> Yes</label></div>
                <div class="radio"><label><input type="radio" name="dataSharingBroad" <g:if test="${issue.dataSharingBroad == '10204'}">checked="checked"</g:if> value="10204"/> No</label></div>
                <div class="radio"><label><input type="radio" name="dataSharingBroad" <g:if test="${issue.dataSharingBroad == '10205'}">checked="checked"</g:if> value="10205"/> Unknown</label></div>
            </div>

            <div class="form-group hidden-form-group" id="dataSharingNih">
                <p>
                    If you plan to deposit data into dbGaP, you may need to comply with NIH's Genomic Data
                    Sharing Policy. (For more information about the policy please visit:
                    <a href="http://gds.nih.gov/03policy2.html">http://gds.nih.gov/03policy2.html</a>)
                    Sample collection date is a key element of determining how the policy may affect your project.
                    Were <span class="underline">all</span> samples collected prior to January 25, 2015
                    (the policy's effective date)?
                </p>

                <div class="radio"><label><input type="radio" name="dataSharingNih" <g:if test="${issue.dataSharingNih == '10207'}">checked="checked"</g:if> value="10207"/> Yes</label></div>
                <div class="radio"><label><input type="radio" name="dataSharingNih" <g:if test="${issue.dataSharingNih == '10208'}">checked="checked"</g:if> value="10208"/> No</label></div>
                <div class="radio"><label><input type="radio" name="dataSharingNih" <g:if test="${issue.dataSharingNih == '10209'}">checked="checked"</g:if> value="10209"/> Unknown</label></div>
            </div>

            <div class="form-group">
                <p>Data Sharing Comments</p>
                <div class="well">
                    <label style="width: 100%;">
                        <textarea name="dataSharingComments" class="form-control editor" rows="10">${issue.dataSharingComments}</textarea>
                    </label>
                </div>
            </div>

        </div>
    </div>

    <div class="panel panel-default">

        <div class="panel-heading">
            <h3 class="panel-title">Attestation</h3>
        </div>

        <div class="panel-body">
            <div class="form-group">
                <p>
                    I confirm that the information provided above is accurate and complete. The Broad researcher
                    associated with the project is aware of this application, and I have the authority to submit it
                    on his/her behalf. <br/>[If obtaining coded specimens/data] I certify that no Broad staff or
                    researchers working on this project will have access to information that would enable the
                    identification of individuals from whom coded samples and/or data were derived.
                    I also certify that Broad staff and researchers will make no attempt to ascertain information about
                    these individuals.
                </p>
                <div class="radio"><label><input type="radio" name="accurate" id="accurate_yes" <g:if test="${issue.accurate == 'Yes'}">checked="checked"</g:if> value="10057" /> Yes</label></div>
                <div class="radio"><label><input type="radio" name="accurate" id="accurate_no" <g:if test="${issue.accurate == 'No'}">checked="checked"</g:if> value="10058" /> No</label></div>

            </div>
        </div>

    </div>


<auth:isOrsp>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">ORSP Determination</h3>
        </div>

        <div class="panel-body">
            <div class="form-group">
                <div class="checkbox">
                    <label>
                        <input type="checkbox" name="notResearch" <g:if test="${issue.notResearch.contains('10133')}">checked="checked"</g:if> value="10133" />
                        This project does not constitute research.
                    </label>
                </div>
                <div class="checkbox">
                    <label>
                        <input type="checkbox" name="notResearch" <g:if test="${issue.notResearch.contains('10134')}">checked="checked"</g:if> value="10134" />
                        This project does not constitute human subjects research.
                    </label>
                </div>
            </div>
        </div>
    </div>
</auth:isOrsp>

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
        let valid3 = validateAccurate();
        return valid1 && valid2 && valid3;
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

    function validateAccurate() {
        if (!$("#accurate_yes").prop('checked') || $("#accurate_no").prop('checked')) {
            let errorDiv = $('<div class="col-md-10 alert alert-danger alert-dismissable">You may not submit this request until you have confirmed that the information provided is accurate and complete.</div>');
            $(errorDiv).insertBefore($("#add-form"));
            $('html, body').animate({ scrollTop: 0 }, 500);
            return false;
        }
        return true;
    }

    $(document).ready(function () {
        $('.datepicker').datepicker();
        $(".radio-message").hide();
        $(".hidden-form-group").hide();

        // Toggle pattern for property style objects.
        togglePropertyMessage("commercially-available", "Yes", "No");

        toggleContinueMessage("research", "10069", "10070");
        toggleContinueMessage("deceased", "10102", "10103");
        toggleContinueMessage("identifiable", "10106", "10107");
        toggleContinueMessage("collHasIdentity", "10126", "10127");
        toggleContinueMessage("collPublication", "10028", "10029");
        toggleContinueMessage("accurate", "10057", "10058");

        $("input[name='dataSharingBroad']").bind(
                'click',
                function() {
                    let args = ["10203", "10205"];
                    let self = $(this);
                    if (args.indexOf(self.val()) >= 0) {
                        $('#dataSharingNih').show();
                    } else {
                        $('#dataSharingNih').hide();
                    }
                }
        );

        // Trigger all of the various form states that exist for each selection
        $("input[type=radio]:checked").click();
    });

</asset:script>
