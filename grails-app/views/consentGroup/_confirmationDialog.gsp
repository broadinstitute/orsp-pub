%{--
This template requires the following arguments:

[
    issue
    consent
    attachmentTypes
]

--}%
<div class="modal-dialog modal-md">
    <div class="modal-content">
        <g:form controller="consentGroup" action="attachConsentDocument" enctype="multipart/form-data" method="POST" class="attach-input">
            <div class="modal-header panel-heading">
                <button type="button" class="close" data-dismiss="modal" style="outline:none"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
            </div>
            <div class="modal-body">
              <p class="modal-large">Are you sure you want to approve reject this Sample / Data Cohort?</p>
            </div>

            <div class="modal-footer">
                    <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                    <g:if test="${action == 'approve'}">
                      <a class="btn btn-primary" href="${createLink(controller: 'newConsentGroup', action: 'approveLink', params: [projectKey: issue.projectKey, consentKey: consent.projectKey])}">
                        Approve
                      </a>
                    </g:if>
                    <g:if test="${action == 'reject'} || ${action == 'unlink'}">
                      <a class="btn btn-primary" href="${createLink(controller: 'consentGroup', action: 'breakLink', params: [projectKey: issue.projectKey, consentKey: consent.projectKey])}">
                        Accept
                      </a>
                    </g:if>
            </div>
        </g:form>
    </div>
</div>
