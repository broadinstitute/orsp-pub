<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<%@ page import="org.broadinstitute.orsp.Fields" %>
<html>
<head>
    <meta name="layout" content="main">
    <title>Request an Engagement Determination</title>
</head>

<body>
<h1>Request an Engagement Determination</h1>

<div class="well col-md-10" id="add-form">
    <g:form action="add">
        <input type="hidden" name="type" value="${IssueType.NE.name}"/>
        <input type="hidden" name="status" value="${IssueStatus.SubmittingToORSP.name}"/>

        <div class="panel panel-default">

            <div class="panel-heading">
                <h3 class="panel-title">Broad Project Details</h3>
            </div>

            <div class="panel-body">

                <div class="form-group">
                    <label for="summary">Broad Project Title</label>
                    <input type="text" name="summary" value="" id="summary" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="requestDate">Date of Request</label>
                    <input type="text" id="requestDate" disabled
                           value="<g:formatDate format="yyyy-MM-dd" date="${date}"/>"
                           class="form-control"/>
                    <input type="hidden" name="requestDate" value="<g:formatDate format="yyyy-MM-dd" date="${date}"/>"/>
                </div>

                <div class="form-group">
                    <label for="source">Sample/Data Provider, and Organizational Affiliation</label>
                    <input type="text" id="source" name="source" value="" class="form-control"/>
                </div>

                <div class="form-group">
                    <label for="ignore-pi">Broad Investigator</label>
                    <span class="badge addPrimaryInvestigator"><span class="glyphicon glyphicon-plus"></span></span>
                    <input type="text" value="" id="ignore-pi" name="ignore-pi" class="form-control userAutocomplete"/>
                    <input type="hidden" name="pi"/>
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
                <h3 class="panel-title">Submission Type</h3>
            </div>

            <div class="panel-body">

                <div class="form-group">
                    <p>
                        Is this an 'Initial Determination Request', or a 'Clarification Request', to ascertain whether a
                        change in the project (e.g. new cohort, change in technology) affects a previous determination?
                    </p>
                    <g:each in="${Fields.SUBMISSION_TYPE_MAP}" var="type">
                        <div class="radio"><label><input type="radio" name="submissionType"
                                                         value="${type.key}"/> ${type.value}
                        </label></div>
                    </g:each>
                </div>

            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Project Information</h3>
            </div>

            <div class="panel-body">
                <div class="form-group">
                    <p>Is this a 'fee-for-service' project? (commercial service only, no Broad publication privileges.)</p>

                    <div class="radio"><label><input type="radio" name="feeForService" value="10124"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="feeForService" value="10125"/> No</label>
                    </div>


                    <div class="radio-message alert alert-info" data-id="10124">
                        This project is eligible for a "not engaged" determination.  Please skip to section 'Funding Information'.
                    </div>

                    <div class="radio-message alert alert-info" data-id="10125">
                        Please continue to the next field.
                    </div>
                </div>

                <div class="form-group">
                    <p>
                        Is a Broad staff member/affiliate interacting or intervening with living human subjects or
                        obtaining their private identifiable information? (Coded data/samples are considered identifiable
                        if researcher <em>or anyone on the study team</em> has access to a key that would allow linkage
                        to private identifiable information.)
                    </p>

                    <div class="radio"><label><input type="radio" name="identifiable" value="10106"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="identifiable" value="10107"/> No</label>
                    </div>

                    <div class="radio-message alert alert-danger" data-id="10106">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10107">Please continue to the next field.</div>
                </div>

                <div class="form-group">
                    <p>
                        Are samples or data being provided to the Broad by an investigator who has private identifiable
                        information?
                    </p>

                    <div class="radio"><label><input type="radio" name="collHasIdentity" value="10126"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="collHasIdentity" value="10127"/> No</label>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10126">Please continue to the next field.</div>

                    <div class="radio-message alert alert-danger" data-id="10127">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>
                </div>

                <div class="form-group">
                    <p>
                        Is the Broad researcher co-publishing or doing joint analysis with an investigator who has access
                        to private identifiable information?
                    </p>

                    <div class="radio"><label><input type="radio" name="collPublication" value="10028"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="collPublication" value="10029"/> No</label>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10028">
                        Please continue to the next field.
                    </div>

                    <div class="radio-message alert alert-danger" data-id="10029">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>
                </div>

            </div>
        </div>

        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Broad Activities</h3>
            </div>

            <div class="panel-body">
                <div class="form-group">
                    <p>
                        Will Broad staff members or affiliates <strong>interact/intervene with, or obtain informed consent</strong>
                        from subjects for research purposes?
                    </p>

                    <div class="radio"><label><input type="radio" name="interact" value="10128"/> Yes</label></div>

                    <div class="radio"><label><input type="radio" name="interact" value="10129"/> No</label></div>

                    <div class="radio-message alert alert-danger" data-id="10128">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10129">Please continue to the next field.</div>
                </div>

                <div class="form-group" id="orsp-id32">
                    <p>
                        Will the Broad
                        a) <strong>obtain coded data or biological specimens</strong> that retain a link to individually
                    identifying information, <strong>and</strong>
                        b) be <strong><span class='underline'>unable</span> to readily ascertain
                    </strong> the identity of
                    the subjects from whom the data or specimens were gathered?
                    </p>

                    <div class="radio"><label><input type="radio" name="codedNotIdentifiable" value="10130"/> Yes
                    </label>
                    </div>

                    <div class="radio"><label><input type="radio" name="codedNotIdentifiable" value="10131"/> No
                    </label>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10130">Please continue to the next field.</div>

                    <div class="radio-message alert alert-danger" data-id="10131">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>
                </div>

                <div class="form-group" id="orsp-id33">
                    <p>
                        If samples/data are coded, will Broad staff members receive <strong>a key to the code</strong> that
                        would enable access to identifiable private information?
                    </p>

                    <div class="radio"><label><input type="radio" name="codes" value="10059"/> Yes</label></div>

                    <div class="radio"><label><input type="radio" name="codes" value="10060"/> No</label></div>

                    <div class="radio-message alert alert-danger" data-id="10059">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10060">Please continue to the next field.</div>
                </div>

            </div>
        </div>


        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Funding Information</h3>
            </div>

            <div class="panel-body">
                <div class="form-group">
                    <p>
                        Will the Broad receive an <strong>award directly from HHS/NIH?</strong>
                    </p>

                    <div class="radio"><label><input type="radio" name="awardNihHhs" value="10135"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="awardNihHhs" value="10136"/> No</label></div>

                    <div class="radio-message alert alert-danger" data-id="10135">
                        STOP here. This project falls under a different regulatory category. <strong>Please contact ORSP.</strong>
                    </div>

                    <div class="radio-message alert alert-info" data-id="10136">Please continue to the next field.</div>
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
                        background information, research activities, the type of data/biological samples to be studied,
                        and who will oversee the project at the Broad.  Submit copies of any sample collection consent
                        forms.  If these are not available, describe why this is the case (proprietary, waiver of consent,
                        commercially purchased, etc).
                    </p>

                    <div class="well">
                        <label style="width: 100%;">
                            <textarea name="description" class="form-control editor" rows="10"></textarea>
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

                    <div class="radio"><label><input type="radio" name="dataSharingBroad" value="10203"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="dataSharingBroad" value="10204"/> No</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="dataSharingBroad" value="10205"/> Unknown
                    </label></div>
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

                    <div class="radio"><label><input type="radio" name="dataSharingNih" value="10207"/> Yes</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="dataSharingNih" value="10208"/> No</label>
                    </div>

                    <div class="radio"><label><input type="radio" name="dataSharingNih" value="10209"/> Unknown
                    </label></div>
                </div>

                <div class="form-group">
                    <p>Data Sharing Comments</p>
                    <div class="well">
                        <label style="width: 100%;">
                            <textarea name="dataSharingComments" class="form-control editor" rows="10"></textarea>
                        </label>
                    </div>
                </div>

            </div>
        </div>


        <div class="panel panel-default">
            <div class="panel-heading">
                <h3 class="panel-title">Broad Responsible Party (or Designee) Attestation</h3>
            </div>

            <div class="panel-body">
                <div class="form-group" id="orsp-id37">
                    <p>
                        I confirm that the information provided above is accurate and complete. The Broad researcher
                        associated with the project is aware of this application, and I have the authority to submit it
                        on his/her behalf. <br/>[If obtaining coded specimens/data] I certify that no Broad staff or
                        researchers working on this project will have access to information that would enable the
                        identification of individuals from whom coded samples and/or data were derived.
                        I also certify that Broad staff and researchers will make no attempt to ascertain information
                        about these individuals.
                    </p>

                    <div class="radio"><label><input type="radio" id="accurate_yes" name="accurate" value="10057"/> Yes</label></div>

                    <div class="radio"><label><input type="radio" id="accurate_no" name="accurate" value="10058"/> No</label></div>
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
                                <input type="checkbox" name="notHSR" value="10132" id="notHSR"/>
                                The Broad Institute is not engaged in human subjects research.
                            </label>
                        </div>
                    </div>
                </div>
            </div>
        </auth:isOrsp>

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
        let valid3 = validateAccurate();
        return valid1 && valid2 && valid3;
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
        toggleContinueMessage("feeForService", "10124", "10125");
        toggleContinueMessage("identifiable", "10106", "10107");
        toggleContinueMessage("collHasIdentity", "10126", "10127");
        toggleContinueMessage("collPublication", "10028", "10029");
        toggleContinueMessage("interact", "10128", "10129");
        toggleContinueMessage("codedNotIdentifiable", "10130", "10131");
        toggleContinueMessage("codes", "10059", "10060");
        toggleContinueMessage("awardNihHhs", "10135", "10136");

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

    });

</asset:script>
