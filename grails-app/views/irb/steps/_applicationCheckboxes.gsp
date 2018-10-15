<%@ page import="org.broadinstitute.orsp.IssueExtraProperty" %>
<div class="pull-right">
    <g:render template="/base/checkbox"
              model="${[field: IssueExtraProperty.APP_ACCEPTED_FLAG, label: 'Application accepted by ORSP']}"/>
    <g:render template="/base/checkbox"
              model="${[field: IssueExtraProperty.APP_SIGNED_FLAG, label: 'Application signed']}"/>
    <g:render template="/base/checkbox"
              model="${[field: IssueExtraProperty.IRB_MOD_REQUESTED_FLAG, label: 'IRB Requested Modification']}"/>
</div>
