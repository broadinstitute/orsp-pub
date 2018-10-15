<%@ page import="org.broadinstitute.orsp.IssueExtraProperty" %>
<g:set var="baseId" value="${new Random().nextInt(100)}"/>
<div>
    <div class="pull-left btn-group-vertical">
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'supportSubmit'),
                          label: 'Submit Supporting Docs to ORSP',
                          message: 'If you have not already uploaded associated documents, please click \"Cancel\" below. ' +
                                  'You must upload documents under the \"Documents\" tab before submitting to ORSP for review.',
                          active: !issue.isFlagSet('supportSubmitted')]}"/>
        <auth:isOrsp>
            <g:render template="/base/actionConfirm"
                      model="${[url: createLink(controller: 'irb', action: 'supportModify'),
                                label: 'Request Modification in Supporting Docs',
                                active: issue.isFlagSet('supportSubmitted') && !issue.isFlagSet('supportAccepted')]}"/>
        </auth:isOrsp>
        <auth:isOrsp>
            <g:render template="/base/actionConfirm"
                      model="${[url: createLink(controller: 'irb', action: 'supportAccept'),
                              label: 'Supporting Documents Deemed Satisfactory',
                              active: issue.isFlagSet('supportSubmitted') && !issue.isFlagSet('supportAccepted')]}"/>
        </auth:isOrsp>

        <g:if test="${!issue.isFlagSet('supportSubmitted') ||
                (session.isOrsp && !issue.isFlagSet('supportAccepted'))}">
            <div></div>
        </g:if>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'appSubmit'),
                          label: 'Submit Application to ORSP',
                          message: "Please ensure that all relevant documents have been uploaded " +
                                  "under the \"Documents\" tab. Press \"Submit to ORSP\" " +
                                  "if ready for review, or \"Cancel\" to return to your application.",
                          active: !issue.isFlagSet('appSubmitted')]}"/>
        <auth:isOrsp>
            <g:render template="/base/actionConfirm"
                      model="${[url: createLink(controller: 'irb', action: 'appModify'),
                              label: 'Request Modification in Application',
                              active: issue.isFlagSet('appSubmitted') && !issue.isFlagSet(IssueExtraProperty.APP_ACCEPTED_FLAG)]}"/>
        </auth:isOrsp>
        <auth:isOrsp>
            <g:render template="/base/actionConfirm"
                      model="${[url: createLink(controller: 'irb', action: 'appAccept'),
                              label: 'ORSP considers Application ready for submission',
                              active: issue.isFlagSet('appSubmitted') && !issue.isFlagSet(IssueExtraProperty.APP_ACCEPTED_FLAG)]}"/>
        </auth:isOrsp>
        <g:if test="${!issue.isFlagSet('appSubmitted') ||
                (session.isOrsp && !issue.isFlagSet(IssueExtraProperty.APP_ACCEPTED_FLAG))}">
            <div></div>
        </g:if>
        <g:render template="/base/actionConfirm"
                  model="${[url: createLink(controller: 'irb', action: 'abandon', params: [id: issue.projectKey]),
                          label: 'Withdraw Project', active: true]}"/>
    </div>

    <g:render template="/irb/steps/checkboxes"/>
    <div class="clearfix"></div>
</div>
