<%@ page import="org.broadinstitute.orsp.Fields" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<div class="pull-right">
    <g:render template="/base/checkbox"
              model="${[field: 'projSubmitted', label: 'Project has been submitted']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'projReviewed', label: 'Project has been reviewed']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'projModRequested', label: 'Modification requested']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'projOrspAccepted', label: 'Project accepted by ORSP']}"/>

%{-- NE forms use NOT_HSR field --}%
    <g:if test="${issue.type?.equals(IssueType.NE.name)}">
        <g:each in="${Fields.NOT_HSR_MAP}" var="entry">
            <g:if test="${issue.notHSR?.equals(entry.key)}">
                <span class="checkmark"><i class="fa fa-check-circle"></i> ${entry.value}</span>
            </g:if>
            <g:else>
                <div><span class="checkmark" style="opacity: 0.5; color: red;"><i class="fa fa-circle-thin"></i> ${entry.value}</span></div>
            </g:else>
        </g:each>
    </g:if>

%{-- NHSR forms use NOT_RESEARCH field --}%
    <g:if test="${issue.type?.equals(IssueType.NHSR.name)}">
        <g:each in="${Fields.NOT_RESEARCH_MAP}" var="entry">
            <g:if test="${issue.notResearch?.contains(entry.key)}">
                <div><span class="checkmark"><i class="fa fa-check-circle"></i> ${entry.value}</span></div>
            </g:if>
            <g:else>
                <div><span class="checkmark" style="opacity: 0.5; color: red;"><i class="fa fa-circle-thin"></i> ${entry.value}</span></div>
            </g:else>
        </g:each>
    </g:if>

    <g:render template="/base/checkbox"
              model="${[field: 'projCoAccepted', label: 'Project approved by Compliance Officer']}"/>
</div>
