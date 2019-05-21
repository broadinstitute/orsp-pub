<html>
<head>
    <meta name="layout" content="main">
    <title>
      <auth:isNotViewer>
        <g:if test="${create}">Create</g:if><g:else>Edit</g:else> Data Use Restrictions for ${consent.projectKey}: ${consent.summary}
      </auth:isNotViewer>
    </title>
    <style type="text/css">
    .clear-well {
        background-color: transparent;
        border-width: 1px;
    }
    ul.ui-autocomplete {
        z-index: 1100;
    }
    </style>
</head>
<body>
    <h3>
      <auth:isNotViewer>
        <g:if test="${create}">Create</g:if><g:else>Edit</g:else> Data Use Restrictions for ${consent.projectKey}: ${consent.summary}
      </auth:isNotViewer>
    </h3>

    <g:form controller="dataUse" action="save" method="POST" role="form">
        <g:hiddenField name="create" value="${create}"/>
        <g:hiddenField name="id" value="${restriction.id}"/>

        <div class="form-group well clear-well">
            <label for="consentGroupKey">Consent Group</label>
            <input type="text"
                   class="form-control"
                   id="consentGroupKey"
                   name="consentGroupKey"
                   value="${restriction.consentGroupKey}"
                   readonly>
        </div>

        <div class="form-group well clear-well">
            <label for="consentPIName">Principal Investigator listed on the informed consent form</label>
            <g:if test="${consent.consent}">
                <input type="text"
                       class="form-control"
                       id="consentPIName"
                       name="consentPIName"
                       value="${restriction.consentPIName}"
                       readonly>
            </g:if>
            <g:else>
                <input type="text"
                       class="form-control"
                       id="consentPIName"
                       name="consentPIName" value="">
            </g:else>
        </div>

        <h4> Data Use Limitations </h4>

        <div id="create-edit-form" class="form-group well clear-well clearfix">

            <div class="container">

                <div class="row">
                    <div class="col-sm-7">
                        <label for="generalUseYes">Data is available for future general research use
                        [<abbr title="For health/medical/biomedical purposes and other biological research, including the study of population origins or ancestry.">GRU</abbr>]
                        </label>

                        <span class="pull-right">
                            <label class="radio-inline"><input type="radio"
                                                               name="generalUse"
                                                               id="generalUseYes"
                                                               <g:if test="${restriction.generalUse && !create}">checked</g:if>
                                                               value="Yes">Yes</label>
                            <label class="radio-inline"><input type="radio"
                                                               name="generalUse"
                                                               id="generalUseNo"
                                                               <g:if test="${!restriction.generalUse && !create}">checked</g:if>
                                                               value="No">No</label>
                        </span>
                    </div>
                    <div class="col-sm-4 alert alert-info">
                        Selecting General Use <strong>[GRU]</strong>:
                        <ul>
                            <li>Disables <strong>[HMB]</strong></li>
                            <li>Clears all Disease Restrictions <strong>[DS]</strong></li>
                            <li>Enables Control Set Usage <strong>[CTRL]</strong></li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-7">
                        <label for="hmbResearchYes">Data is limited for health/medical/biomedical research
                        [<abbr title="Use of the data is limited to health/medical/biomedical purposes, does not include the study of population origins or ancestry.">HMB</abbr>]
                        </label>

                        <span class="pull-right">
                            <label class="radio-inline"><input type="radio"
                                                               name="hmbResearch"
                                                               id="hmbResearchYes"
                                                               <g:if test="${restriction.hmbResearch && !create}">checked</g:if>
                                                               value="Yes">Yes</label>

                            <label class="radio-inline"><input type="radio"
                                                               name="hmbResearch"
                                                               id="hmbResearchNo"
                                                               <g:if test="${!restriction.hmbResearch && !create}">checked</g:if>
                                                               value="No">No</label>
                        </span>
                    </div>
                    <div class="col-sm-4 alert alert-info">
                        Selecting Health, Medical, Biomedical <strong>[HMB]</strong>:
                        <ul>
                            <li>Disables <strong>[GRU]</strong></li>
                            <li>Clears Disease Restrictions <strong>[DS]</strong></li>
                            <li>Prevents Population Origins or Ancestry Usage <strong>[POA]</strong></li>
                        </ul>
                    </div>
                </div>
                <div class="row">
                    <div class="col-sm-7">
                        <label for="diseaseRestrictions">Future use is limited to research involving the following disease area(s)
                        [<abbr title="Use of the data must be related to [disease].">DS</abbr>]
                        </label>
                        <span class="badge addDiseaseRestriction"><span class="glyphicon glyphicon-plus"></span></span>
                        <g:if test="${restriction.diseaseRestrictions}">
                            <g:each in="${restriction.diseaseRestrictions}" var="classId">

                                <div class="input-group">
                                    <input type="text"
                                           class="form-control diseaseAutocomplete"
                                           id="diseaseRestrictions_${classId}"
                                           name="diseaseRestrictions"
                                           value="${classId}"/>
                                    <div class="input-group-addon removeRestriction" title="Remove">Remove</div>
                                </div>

                            </g:each>
                        </g:if>
                        <g:else>
                            <div>
                                <input type="text"
                                       class="form-control diseaseAutocomplete"
                                       id="diseaseRestrictions"
                                       name="diseaseRestrictions"/>
                            </div>
                        </g:else>
                    </div>
                    <div class="col-sm-4 alert alert-info">
                        Choosing a disease restriction <strong>[DS]</strong>:
                        <ul>
                            <li>Disables <strong>[GRU]</strong></li>
                            <li>Disables <strong>[HMB]</strong></li>
                            <li>Prevents Population Origins or Ancestry Usage <strong>[POA]</strong></li>
                        </ul>
                    </div>
                </div>

            </div>
        </div>

        <div class="restriction form-group well clear-well clearfix" id="populationAncestrySection">
            <label for="populationOriginsAncestryYes">Future use of population origins or ancestry is prohibited
                [<abbr title="Use of the data is limited to the study of population origins or ancestry.">POA</abbr>]
            </label>

            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="populationOriginsAncestry"
                              id="populationOriginsAncestryYes"
                              <g:if test="${restriction.populationOriginsAncestry && !create}">checked</g:if>
                              value="Yes">Yes</label>

                <label class="radio-inline"><input type="radio"
                              name="populationOriginsAncestry"
                              id="populationOriginsAncestryNo"
                              <g:if test="${!restriction.populationOriginsAncestry && !create}">checked</g:if>
                              value="No">No</label>
            </span>
        </div>


        <div class="restriction form-group well clear-well clearfix">
            <label for="commercialUseExcludedYes">Future commercial use is prohibited
                [<abbr title="Use of the data is limited to non-commercial use.">NCU</abbr>]
            </label>

            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="commercialUseExcluded"
                              id="commercialUseExcludedYes"
                              <g:if test="${restriction.commercialUseExcluded && !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="commercialUseExcluded"
                              id="commercialUseExcludedNo"
                              <g:if test="${!restriction.commercialUseExcluded && !create}">checked</g:if>
                              value="No">No</label>
            </span>
        </div>

        <div class="restriction form-group well clear-well clearfix">
            <label for="methodsResearchExcludedYes">Future use for methods research (analytic/software/technology
            development) is prohibited [<abbr title="Use of the data includes methods development research (e.g., development of software or algorithms) ONLY within the bounds of other specified data use limitations.">NMDS</abbr>]</label>
            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="methodsResearchExcluded"
                              id="methodsResearchExcludedYes"
                              <g:if test="${restriction.methodsResearchExcluded&& !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="methodsResearchExcluded"
                              id="methodsResearchExcludedNo"
                              <g:if test="${!restriction.methodsResearchExcluded && !create}">checked</g:if>
                              value="No">No</label>
            </span>
        </div>

        <div class="restriction form-group well clear-well clearfix">
            <label for="aggregateResearchResponseYes">Future use of aggregate-level data for general research purposes
            is prohibited [<abbr title="Use of the data includes aggregate level analysis to address research questions (e.g., determine variant frequencies across the general population) ONLY within the bounds of other specified data use limitations.">NAGR</abbr>] </label>
            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="aggregateResearchResponse"
                              id="aggregateResearchResponseYes"
                              <g:if test="${restriction.aggregateResearchResponse?.equals("Yes") && !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="aggregateResearchResponse"
                              id="aggregateResearchResponseNo"
                              <g:if test="${restriction.aggregateResearchResponse?.equals("No") && !create}">checked</g:if>
                              value="No">No</label>
                <label class="radio-inline"><input type="radio"
                              name="aggregateResearchResponse"
                              id="aggregateResearchResponseUnspecified"
                              <g:if test="${restriction.aggregateResearchResponse?.equals("Unspecified") && !create}">checked</g:if>
                              value="Unspecified">Unspecified</label>
            </span>
        </div>

        <div class="restriction form-group well clear-well clearfix">
            <label for="controlSetOptionYes"> Future as a control set for diseases other than those specified is
            prohibited [<abbr title="Data can be used as a control set to study any disease type.">CTRL</abbr>]
            </label>

            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="controlSetOption"
                              id="controlSetOptionYes"
                              <g:if test="${restriction.controlSetOption?.equals("Yes") && !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="controlSetOption"
                              id="controlSetOptionNo"
                              <g:if test="${restriction.controlSetOption?.equals("No") && !create}">checked</g:if>
                              value="No">No</label>
                <label class="radio-inline"><input type="radio"
                              name="controlSetOption"
                              id="controlSetOptionUnspecified"
                              <g:if test="${restriction.controlSetOption?.equals("Unspecified") && !create}">checked</g:if>
                              value="Unspecified">Unspecified</label>
            </span>
        </div>

        <div class="restriction form-group well clear-well clearfix" id="populationRestrictionsContainer">

            <label for="genderMale">Future use is limited to research involving a particular gender
            [<abbr title="Use of the data is limited to studies of particular gender.">RS-M</abbr>] /
            [<abbr title="Use of the data is limited to studies of particular gender.">RS-FM</abbr>]
            </label>
            <span class="pull-right">
                <label class="radio-inline">
                    <input type="radio"
                           name="gender"
                           id="genderMale"
                           <g:if test="${restriction.gender?.equals("Male") && !create}">checked</g:if>
                           value="Male">Male</label>
                <label class="radio-inline"><input type="radio"
                              name="gender"
                              id="genderFemale"
                              <g:if test="${restriction.gender?.equals("Female") && !create}">checked</g:if>
                              value="Female">Female</label>
                <label class="radio-inline"><input type="radio"
                              name="gender"
                              id="genderNA"
                              <g:if test="${!restriction.gender?.equals("Male") && !restriction.gender?.equals("Female") && !create}">checked</g:if>
                              value="NA">N/A</label>
            </span>

            <hr/>
            <label for="pediatricYes">Future use is limited to pediatric research
            [<abbr title="Use of the data is limited to pediatric research.">RS-PD</abbr>]</label>
            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="pediatric"
                              id="pediatricYes"
                              <g:if test="${restriction.pediatricLimited && !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="pediatric"
                              id="pediatricNo"
                              <g:if test="${!restriction.pediatricLimited && !create}">checked</g:if>
                              value="No">No</label>
            </span>
            <hr/>

            <span>
                <label for="populationRestrictions">Future use is limited to research involving a specific population
                [<abbr title="Use of the data is limited to tudies of particular population.">RS-POP</abbr>]</label>
                <span class="badge addPopulationRestriction"><span class="glyphicon glyphicon-plus"></span></span>
                <g:if test="${restriction.populationRestrictions}">
                    <g:each in="${restriction.populationRestrictions}" var="classId">
                        <div class="input-group">
                            <input type="text"
                                   class="form-control populationAutocomplete"
                                   id="populationRestrictions_${classId}"
                                   name="populationRestrictions"
                                   value="${classId}"/>
                            <div class="input-group-addon removeRestriction" title="Remove">Remove</div>
                        </div>
                    </g:each>
                </g:if>
                <g:else>
                    <input type="text"
                           class="form-control populationAutocomplete"
                           id="populationRestrictions"
                           name="populationRestrictions"/>
                </g:else>
            </span>

        </div>

        <div class="restriction form-group well clear-well">
            <div>
                <label for="dateRestriction">Future use is limited to data generated from samples collected after the following consent form date</label>
            </div>

            <div class="btn-group pull-left">
                <button type="button" id="After" class="btn btn-default">After</button>
            </div>

            <div class="input-group">
                <input type="text"
                       class="datepicker form-control"
                       value="<g:formatDate date="${restriction.dateRestriction}" format="MM/dd/yyyy"/>"
                       name="dateRestriction"
                       id="dateRestriction"/>
                <span class="input-group-addon"><i class="glyphicon glyphicon-calendar"></i></span>
            </div>
        </div>

        <h4> Terms of Use </h4>

        <div class="form-group well clear-well clearfix">
            <label for="recontactingDataSubjectsYes"> Is there a possibility for recontacting data subjects? </label>
            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="recontactingDataSubjects"
                              id="recontactingDataSubjectsYes"
                              <g:if test="${restriction.recontactingDataSubjects && !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="recontactingDataSubjects"
                              id="recontactingDataSubjectsNo"
                              <g:if test="${!restriction.recontactingDataSubjects && !create}">checked</g:if>
                              value="No">No</label>
            </span>
            <div id="recontact-info">
                <hr/>
                <label for="recontactMayOccur">Subject re-contact <em> may </em> occur in certain circumstances, as specified </label>
                <input type="text" id="recontactMayOccur" name="recontactMay" class="form-control" value="${restriction.recontactMay}">
                <hr/>
                <label for="recontactMustOccur">Subject re-contact <em> must </em> occur in certain circumstances, as specified </label>
                <input type="text"  id="recontactMustOccur" name="recontactMust" class="form-control" value="${restriction.recontactMust}">
            </div>
        </div>

        <div class="form-group well clear-well clearfix">
            <label for="genomicPhenotypicDataYes"> Did participants consent to the use of their genomic and phenotypic data for future research and broad sharing?</label>
            <span class="pull-right">
                <label class="radio-inline"><input type="radio"
                              name="genomicPhenotypicData"
                              id="genomicPhenotypicDataYes"
                              <g:if test="${restriction.genomicPhenotypicData?.equals("Yes") && !create}">checked</g:if>
                              value="Yes">Yes</label>
                <label class="radio-inline"><input type="radio"
                              name="genomicPhenotypicData"
                              id="genomicPhenotypicDataNo"
                              <g:if test="${restriction.genomicPhenotypicData?.equals("No") && !create}">checked</g:if>
                              value="No">No</label>
                <label class="radio-inline"><input type="radio"
                              name="genomicPhenotypicData"
                              id="genomicPhenotypicDataUnspecified"
                              <g:if test="${restriction.genomicPhenotypicData?.equals("Unspecified") && !create}">checked</g:if>
                              value="Unspecified">Unspecified</label>
            </span>
        </div>

        <div class="form-group well clear-well clearfix">
            <div id="other-terms">
                <label for="cloudStorageYes">Data storage on the cloud is prohibited?</label>
                <span class="pull-right">
                    <label class="radio-inline"><input type="radio"
                                  name="cloudStorage"
                                  id="cloudStorageYes"
                                  <g:if test="${restriction.cloudStorage?.equals("Yes") && !create}">checked</g:if>
                                  value="Yes">Yes</label>
                    <label class="radio-inline"><input type="radio"
                                  name="cloudStorage"
                                  id="cloudStorageNo"
                                  <g:if test="${restriction.cloudStorage?.equals("No") && !create}">checked</g:if>
                                  value="No">No</label>
                    <label class="radio-inline"><input type="radio"
                                  name="cloudStorage"
                                  id="cloudStorageUnspecified"
                                  <g:if test="${restriction.cloudStorage?.equals("Unspecified") && !create}">checked</g:if>
                                  value="Unspecified">Unspecified</label>
                </span>
                <hr/>
                <label for="irbYes">Ethics committee approval required?</label>
                <span class="pull-right">
                    <label class="radio-inline"><input type="radio"
                                  name="irb"
                                  id="irbYes"
                                  <g:if test="${restriction.irb && !create}">checked</g:if>
                                  value="Yes">Yes</label>
                    <label class="radio-inline"><input type="radio"
                                  name="irb"
                                  id="irbNo"
                                  <g:if test="${!restriction.irb && !create}">checked</g:if>
                                  value="No">No</label>
                </span>

                <hr/>
                <label for="geographicalRestrictions">Geographical restrictions?</label>
                <input type="text"  id="geographicalRestrictions" name="geographicalRestrictions" class="form-control" value="${restriction.geographicalRestrictions}">
                <hr/>
                <label for="otherFreeText">Other terms of use?</label>
                <textarea id="otherFreeText" name="other" class="form-control editor" rows="3">${restriction.other}</textarea>
                <br/>
                <label for="manualReviewRestriction">Future use of this data requires manual review</label>
                <span class="pull-right">

                    <label class="radio-inline"><input type="radio"
                                  name="manualReview"
                                  id="manualReviewYes"
                                  <g:if test="${restriction.manualReview && !create}">checked</g:if>
                                  value="Yes">Yes</label>
                    <label class="radio-inline"><input type="radio"
                                  name="manualReview"
                                  id="manualReviewNo"
                                  <g:if test="${!restriction.manualReview && !create}">checked</g:if>
                                  value="No">No</label>
                </span>
            </div>
        </div>

        <div class="form-group well clear-well">
            <label for="restrictionComments">Comments (ORSP Use Only)</label>
            <textarea id="restrictionComments" name="comments" class="form-control editor" rows="3">${restriction.comments}</textarea>
        </div>

        <div class="modal-footer">
            <input type="reset" class="btn btn-default" value="Reset"/>
            <g:submitButton
                    id="Save"
                    name="Save"
                    value="Save"
                    class="upload-button btn btn-default btn-primary"
                    onclick="return validateForm();"/>
        </div>
    </g:form>

</body>
</html>

<asset:script type="text/javascript">
    const onInit = true;

    // Register required validation functions here.
    function validateForm() {
        $(".alert-danger").remove();
        return validateGruHmbDisease();
    }

    function validateGruHmbDisease() {
        let gru = $("#generalUseYes").prop("checked");
        let hmb = $("#hmbResearchYes").prop("checked");
        let diseases = $(".diseaseAutocomplete")
            .filter((elem) => (elem !== undefined))
            .map(function() { return ($(this).val() !== undefined && $(this).val().length > 0)})
            .get()
            .filter((elem) => elem);
        let dis = (diseases !== undefined && diseases.length > 0);
        let checkedVals = [gru, hmb, dis].filter(function(v){return v === true;});
        if (checkedVals.length === 1) {
            return true;
        } else  {
            let errorDiv = $('<div class="col-md-12 alert alert-danger alert-dismissable">At least one of GRU, HMB, or a Disease Restriction must be selected.</div>');
            $(errorDiv).insertBefore($("#create-edit-form"));
            $('html, body').animate({ scrollTop: 0 }, 500);
            return false;
        }
    }

    function initializeForm() {
        setManualReview(onInit);
        applyDiseaseAutocomplete();
        applyPopulationAutocomplete();
        if ($("#recontactingDataSubjectsYes").prop("checked")) {
            $("#recontact-info").show();
        } else {
            $("#recontact-info").hide();
        }
    }

    $(document).ready(function() {

        $('.datepicker').datepicker();

        /*
            See https://broadinstitute.atlassian.net/browse/GAWB-3210
            General Use, HMB, and Disease Restrictions are intertwined and exclusive. One has to
            choose one of the three.
              * GRU means HMB == no && no diseases && controlSet == yes
              * HMB means GRU == no && no diseases && POA == yes
              * Diseases means GRU == no && HMB == no && POA == yes
         */

        $("input[name='generalUse']").on("click", function() {
            if ($("#generalUseYes").prop("checked")) {
                $("#hmbResearchYes").prop("checked", false);
                $("#hmbResearchNo").prop("checked", true);
                $(".diseaseAutocomplete").each(function( index ) { $(this).val(""); });
                $("#controlSetOptionNo").prop("checked", true);
            }
        });

        $("[name='irb'], [name='dateRestriction'], [name='cloudStorage'], [name='geographicalRestrictions'], [name='aggregateResearchResponse'], [name='populationRestrictions']").on("change", function() {
            setManualReview();
        });

        $("input[name='hmbResearch']").on("click", function() {
            if ($("#hmbResearchYes").prop("checked")) {
                $("#generalUseYes").prop("checked", false);
                $("#generalUseNo").prop("checked", true);
                $(".diseaseAutocomplete").each(function( index ) { $(this).val(""); });
                $("#populationOriginsAncestryYes").prop("checked", true);
                $("#populationOriginsAncestryNo").prop("checked", false);
            }
         });

        $("input[name='recontactingDataSubjects']").on("click", function() {
            if ($("#recontactingDataSubjectsYes").prop("checked")) {
                $("#recontact-info").show();
            } else {
                $("#recontact-info").hide();
            }
        });


        applyRemoveRestrictionHandler();

        $("span.addDiseaseRestriction").
            css({"cursor": "pointer"}).
            on('click',
                function () {
                    var input = $('<div class="input-group"><input type="text" class="diseaseAutocomplete form-control" name="diseaseRestrictions" /><div class="input-group-addon removeRestriction" title="Remove">Remove</div></div>');
                    $(this).parent().append(input);
                    applyDiseaseAutocomplete();
                    applyRemoveRestrictionHandler();
                    $(".diseaseAutocomplete").last().focus();
            });

        $("span.addPopulationRestriction").
            css({"cursor": "pointer"}).
            on('click',
                function () {
                    var input = $('<div class="input-group"><input type="text" class="populationAutocomplete form-control" name="populationRestrictions" /><div class="input-group-addon removeRestriction" title="Remove">Remove</div></div>');
                    $(this).parent().append(input);
                    applyPopulationAutocomplete();
                    applyRemoveRestrictionHandler();
                    $(".populationAutocomplete").last().focus();
            });

        initializeForm();

    });

    function applyRemoveRestrictionHandler() {
        $("div.removeRestriction").
            css({"cursor": "pointer"}).
            on('click',
                function () {
                    $(this).parent().remove();
            });
    }

    function applyDiseaseAutocomplete() {
        $(".diseaseAutocomplete").autocomplete({
            appendTo: "#diseaseRestrictionsContainer",
            source: "${createLink(controller: 'search', action: 'getMatchingDiseaseOntologies')}",
            minLength: 2,
            change: function (event, ui) {
                // This implements a "must-match" constraint
                if (!ui.item) {
                    $(this).val('');
                }
            },
            focus: function(event, ui) {
                $(this).val(ui.item.id);
                return false;
            },
            select: function(event, ui) {
                $(this).val(ui.item.id);
                // This affects other form controls based on a positive disease selection
                if ($(this).val().length > 0) {
                    $("#generalUseYes").prop("checked", false);
                    $("#generalUseNo").prop("checked", true);
                    $("#hmbResearchYes").prop("checked", false);
                    $("#hmbResearchNo").prop("checked", true);
                    $("#populationOriginsAncestryYes").prop("checked", true);
                    $("#populationOriginsAncestryNo").prop("checked", false);
                    $("#controlSetOptionYes").prop("checked", true);
                }
                return false;
            },
            create: function () {
                $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                    var synonyms = (item.synonyms) ? item.synonyms.join(", ") : "";
                    var definition = (item.definition) ? item.definition.join(", ") : "";
                    return $("<li></li>")
                        .data("ui-autocomplete-item", {value: item.id})
                        .append($("<a>", {"class": "disease-name"}).append(item.label))
                        .append($("<div>", {"class": "disease-definition"}).append(item.id))
                        .append($("<div>", {"class": "disease-definition"}).append(synonyms))
                        .append($("<div>", {"class": "disease-definition"}).append(definition))
                        .appendTo(ul);
                };
            }
        });
    }

    function applyPopulationAutocomplete() {
        $(".populationAutocomplete").autocomplete({
            appendTo: "#populationRestrictionsContainer",
            source: "${createLink(controller: 'search', action: 'getMatchingPopulationOntologies')}",
            minLength: 2,
            change: function (event, ui) {
                // This implements a "must-match" constraint
                if (!ui.item) {
                    $(this).val('');
                }
            },
            focus: function(event, ui) {
                $(this).val(ui.item.id);
                return false;
            },
            select: function(event, ui) {
                $(this).val(ui.item.id);
                return false;
            },
            create: function () {
                $(this).data('ui-autocomplete')._renderItem = function (ul, item) {
                var synonyms = (item.synonyms) ? item.synonyms.join(", ") : "";
                var definition = (item.definition) ? item.definition.join(", ") : "";
                return $("<li></li>")
                    .data("ui-autocomplete-item", {value: item.id})
                    .append($("<a>", {"class": "disease-name"}).append(item.label))
                    .append($("<div>", {"class": "disease-definition"}).append(item.id))
                    .append($("<div>", {"class": "disease-definition"}).append(synonyms))
                    .append($("<div>", {"class": "disease-definition"}).append(definition))
                    .appendTo(ul);
                };
            }
        });
    }

    function setManualReview(initiate = null) {
        const dateValue = $("#dateRestriction").prop("value");
        const geographicalResValue = $("#geographicalRestrictions").prop("value");
        const populationRestrictions = $("#populationRestrictions").prop("value");
        const manualReview = "$(restriction.manualReview)";

        if (isNotEmpty(populationRestrictions) ||
            isNotEmpty(dateValue) ||
            $("#cloudStorageYes").prop("checked") ||
            $("#irbYes").prop("checked") ||
            isNotEmpty(geographicalResValue) ||
            $("#aggregateResearchResponseYes").prop("checked")) {
            $("#manualReviewYes").prop("checked", true).trigger("click");
            $("#manualReviewNo").prop("disabled", true);
        } else if(!manualReview && initiate) {
            $("#manualReviewNo").prop("disabled", false);
            $("#manualReview").prop("checked", ${restriction.manualReview}).trigger("click");
        } else {
            $("#manualReviewNo").prop("disabled", false);
            $("#manualReviewNo").prop("checked", true).trigger("click");
        }

    function isNotEmpty(element) {
        return (element !== "" && element !== null && element !== undefined && element.length > 0);
    }
}
</asset:script>
