<%@ page import="org.broadinstitute.orsp.IssueExtraProperty" %>
<div class="pull-right">
    <g:render template="/base/checkbox"
              model="${[field: 'supportSubmitted', label: 'Supporting Documents submitted']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'supportReviewed', label: 'Supporting Documents reviewed']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'supModRequested', label: 'Mod. Requested in Supporting Docs']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'supportAccepted', label: 'Supporting Documents Deemed Satisfactory']}"/>
    <div></div>
    <g:render template="/base/checkbox"
              model="${[field: 'appSubmitted', label: 'Application submitted to ORSP']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'appReviewed', label: 'Application reviewed']}"/>
    <g:render template="/base/checkbox"
              model="${[field: 'appModRequested', label: 'Mod. Requested in Application']}"/>
    <g:render template="/base/checkbox"
              model="${[field: IssueExtraProperty.APP_ACCEPTED_FLAG, label: 'ORSP considers Application ready for submission']}"/>
    <div></div>
    <g:render template="/base/checkbox"
              model="${[field: IssueExtraProperty.APP_SIGNED_FLAG, label: 'Application signed']}"/>
    <g:render template="/base/checkbox"
              model="${[field: IssueExtraProperty.IRB_MOD_REQUESTED_FLAG, label: 'IRB Requested Modification']}"/>
</div>
