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
        <g:form controller="clarification" action="addClarificationRequest" method="POST">
            <div class="modal-header panel-heading">
                <button type="button" class="close" data-dismiss="modal" style="outline:none"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">Request Clarification on ${issue.projectKey}</h4>
            </div>
            <input name="id" value="${issue.projectKey}" id="id" type="hidden">
            <input name="type" value="link" id="type" type="hidden">

            <div class="modal-body">
                    <div class="inputField ">
                        <p class="inputFieldLabel">Please describe the clarification you are requesting</p>
                        <div class="inputFieldWrapper">
                            <textarea name="comment" id="comment" rows="5" class="form-control inputFieldTextarea" style="resize: none"></textarea>
                        </div>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <input name="requestClarification" class="btn btn-primary" value="Request Clarification" id="rc" type="submit">
            </div>
        </g:form>
    </div>
</div>


