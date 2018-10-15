<%@ page import="org.broadinstitute.orsp.BooleanOptions" %>
<%@ page import="org.broadinstitute.orsp.Fields" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Project Information</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Protocol #</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.protocol]"/>
        </div>

        <g:if test="${issue.expirationDate}">
            <div class="property-label">Expiration Date</div>
            <div class="property-value well well-sm">
                <g:render template="/base/value" model="[value: issue.expirationDate]"/>
            </div>
        </g:if>

        <div class="property-label">Brief Project Description</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.description]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">People</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">PI</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: [pis.collect{it.displayName}].flatten()]"/>
        </div>

        <div class="property-label">PI Affiliation</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: Fields.affiliationValues(issue.affiliations)]"/>
        </div>

        <g:if test="${issue.affiliations.contains("10054")}">
            <div class="property-label">PI Other Affiliation</div>
            <div class="property-value well well-sm">
                <g:render template="/base/value" model="[value: issue.affiliationOther]"/>
            </div>
        </g:if>

        <div class="property-label">Project Manager</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: [pms.collect{it.displayName}].flatten()]"/>
        </div>

    </div>
</div>

<g:render template="/common/fundingPanel" model="${[fundings: issue.fundings]}"/>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">IRB</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">Preferred Broad IRB</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: PreferredIrb.getLabelForKey(issue.irb)]"/>
        </div>

        <div class="property-label">Brief rationale for IRB selection</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: issue.rationale]"/>
        </div>

    </div>
</div>

<g:render template="/common/samplesPanel"/>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">dbGAP</h3>
    </div>
    <div class="panel-body">

        <div class="property-label">dbGAP?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.dbgap)]"/>
        </div>

        <div class="property-label">If data will be submitted to dbGAP, is Broad responsible for this submission?</div>
        <div class="property-value well well-sm">
            <g:render template="/base/value" model="[value: BooleanOptions.getLabelForKey(issue.responsible)]"/>
        </div>

    </div>
</div>

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Review Category</h3>
    </div>
    <div class="panel-body">

        <div class="property-value well well-sm">
            ${issue.reviewCategory}
        </div>

    </div>
</div>