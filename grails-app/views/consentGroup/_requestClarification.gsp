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
                <h4 class="modal-title">Request Clarification on ${consent.projectKey}</h4>
            </div>
            <div class="modal-body">
                    <div class="inputField ">
                        <p class="inputFieldLabel">Please describe the clarification you are requesting</p>
                        <div class="inputFieldWrapper">
                            <textarea name="clarification" id="xx" rows="5" class="form-control inputFieldTextarea" style="resize: none"></textarea>
                        </div>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel Request Clarification</button>
                <input name="Upload" class="upload-button btn btn-default btn-primary" value="Upload" id="Upload" type="submit">
            </div>
        </g:form>
    </div>
</div>
