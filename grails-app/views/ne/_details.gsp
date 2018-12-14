<%@ page import="org.broadinstitute.orsp.BooleanOptions" %>
<%@ page import="org.broadinstitute.orsp.Fields" %>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Broad Project Details</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Date of Request</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.requestDate]"/>
        </div>

        <div class="property-label">Sample/Data Provider, and Organizational Affiliation</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.source]"/>
        </div>

        <div class="property-label">Broad Investigator</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: [pis.collect{it.displayName}].flatten()]"/>
        </div>

        <div class="property-label">Broad Project Manager/Submitter</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: [pms.collect{it.displayName}].flatten()]"/>
        </div>

    </div>
</div>

<g:render template="/common/fundingPanel" model="${[fundings: issue.fundings]}"/>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Submission Type</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Is this an 'Initial Determination Request', or a 'Clarification Request', to ascertain whether a change in the project (e.g. new cohort, change in technology) affects a previous determination?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: Fields.SUBMISSION_TYPE_MAP.get(issue.submissionType)]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Project Information</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Is this a 'fee-for-service' project?  (No Broad investigator involved, no co-publication planned.)</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.feeForService)]"/>
        </div>

        <div class="property-label">As part of the research, is a Broad staff member/affiliate interacting or intervening with living human subjects or obtaining their private identifiable information/biospecimens? (Coded data/samples are considered identifiable if researcher <em>or anyone on the study team</em> has access to key that would allow linkage to personal identifiers.)</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.identifiable)]"/>
        </div>

        <div class="property-label">Are samples or data being provided to the Broad by an investigator who has private identifiable information/biospecimens?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.collHasIdentity)]"/>
        </div>

        <div class="property-label">Is the Broad researcher co-publishing or doing joint analysis with an investigator who has access to private identifiable information/biospecimens?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.collPublication]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Broad Employee Activities</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Will Broad employees <strong>interact/intervene with, or obtain informed consent</strong> from subjects for research purposes?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.interact)]"/>
        </div>

        <div class="property-label">
            Will the Broad a) <strong>obtain coded data or biological specimens</strong> that retain a link to individually identifying information, <strong>and</strong> b) be <strong><span class='underline'>unable</span> to readily ascertain</strong> the identity of the subjects from whom the data or specimens were gathered?
        </div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.codedNotIdentifiable)]"/>
        </div>

        <div class="property-label">If samples/data are coded, will Broad staff members receive <strong>a key to the code</strong> that would enable access to identifiable private information?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.codes)]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Funding Information</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Will the Broad receive an <strong>award directly from HHS/NIH?</strong></div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.awardNihHhs)]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Project Description</h3>
    </div>
    <div class="panel-body">

        <div class="property-label"></div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.description]"/>
        </div>

    </div>
</div>

<g:render template="/common/samplesPanel"/>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Broad Data Sharing Plans</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Are there plans for the Broad to deposit data from this project into a public or controlled access data repository (e.g. dbGaP), due to either a) use of federal funding or b) possible future publication requirements?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.dataSharingBroad)]"/>
        </div>

        <g:if test="${!BooleanOptions.getLabelForKey(issue.dataSharingBroad)?.equals('No')}">
            <div class="property-label">If you plan to deposit data into dbGaP, you may need to comply with NIH's Genomic Data Sharing Policy.  (For more information about the policy please visit: <a href=\"http://gds.nih.gov/03policy2.html\">http://gds.nih.gov/03policy2.html</a>.)   Sample collection date is a key element of determining how the policy may affect your project.  Were <u>all</u> samples collected prior to January 25, 2015 (the policy's effective date)?</div>
            <div class="property-value well well-sm">
                <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.dataSharingNih)]"/>
            </div>
        </g:if>

        <div class="property-label">Data Sharing Comments</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.dataSharingComments]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Broad Responsible Party (or Designee) Attestation</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">I confirm that the information provided above is accurate and complete. The Broad researcher associated with the project is aware of this application, and I have the authority to submit it on his/her behalf.<br/>[If obtaining coded specimens/data] I certify that no Broad staff or researchers working on this project will have access to information that would enable the identification of individuals from whom coded samples and/or data were derived. I also certify that Broad staff and researchers will make no attempt to ascertain information about these individuals.</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.accurate]"/>
        </div>

    </div>
</div>

<auth:isOrsp>
    <div class="panel panel-default">
        <div class="panel-heading">
            <h3 class="panel-title">ORSP Determination</h3>
        </div>
        <div class="panel-body">

            <div class="property-label"></div>
            <div class="property-value well well-sm">
                <g:each in="${Fields.NOT_HSR_MAP}" var="entry">
                    <g:if test="${issue.notHSR?.equals(entry.key)}">
                        <span class="checkmark"><i class="fa fa-check-circle"></i> ${entry.value}</span>
                    </g:if>
                    <g:else>
                        <span class="checkmark" style="opacity: 0.5"><i class="fa fa-circle-thin"></i> ${entry.value}</span>
                    </g:else>
                </g:each>
            </div>
        </div>
    </div>
</auth:isOrsp>
