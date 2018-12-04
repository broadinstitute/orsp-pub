<%@ page import="org.broadinstitute.orsp.BooleanOptions" %>
<%@ page import="org.broadinstitute.orsp.Fields" %>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Project Information</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Date of Request</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.requestDate]"/>
        </div>

        <div class="property-label">Broad Investigator</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: [pis.collect{it.displayName}].flatten()]"/>
        </div>

        <div class="property-label">Project Manager</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: [pms.collect{it.displayName}].flatten()]"/>
        </div>

        <div class="property-label">Sample/Data Provider, and Organizational Affiliation</div>
        <div class="property-value well well-sm">${issue.source}</div>

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
        <h3 class="panel-title">Are Project Activities Research?</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Is the activity a 'systematic investigation designed to develop or contribute to <strong>generalizable knowledge</strong>'? [Examples of activities that might not result in generalizable knowledge include: single case studies and internal technology development/feasibility projects (not intended for external adoption or use).]</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.research)]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Does the research involve human subjects?</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Does the project involve samples/cell lines that are all commercially available?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.commerciallyAvailable]"/>
        </div>

        <div class="property-label">Are <strong>all</strong> the subjects from whom samples and/or data were derived now deceased?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.deceased)]"/>
        </div>

        <div class="property-label">Is a Broad staff member/affiliate <strong>interacting/intervening with human subjects or obtaining their private identifiable information?</strong> (Coded data/samples are considered identifiable if the researcher or anyone on the study team has access to a key that would allow linkage to private identifiable information.)</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.identifiable)]"/>
        </div>

        <div class="property-label">Are samples or data being <strong>provided to the Broad by an investigator who has access to private identifiable information?</strong></div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.collHasIdentity)]"/>
        </div>

        <div class="property-label">Is the Broad researcher <strong>co-publishing or doing joint analysis</strong> with investigator who has access to identifiers?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.collPublication]"/>
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
        <h3 class="panel-title">Attestation</h3>
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
                <g:each in="${Fields.NOT_RESEARCH_MAP}" var="entry">
                    <g:if test="${issue.notResearch?.contains(entry.key)}">
                        <span class="checkmark"><i class="fa fa-check-circle"></i> ${entry.value}</span><br/>
                    </g:if>
                    <g:else>
                        <span class="checkmark" style="opacity: 0.5"><i class="fa fa-circle-thin"></i> ${entry.value}</span><br/>
                    </g:else>
                </g:each>
            </div>
        </div>
    </div>
</auth:isOrsp>