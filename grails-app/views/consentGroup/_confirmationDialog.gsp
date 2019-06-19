%{--
This template requires the following arguments:

[
    issue
    consent
    attachmentTypes
]

--}%
<div class="modal-dialog modal-lg">
    <div class="modal-content">
        <g:form controller="consentGroup" action="attachConsentDocument" enctype="multipart/form-data" method="POST" class="attach-input">
            <div class="modal-header panel-heading">
                <button type="button" class="close" data-dismiss="modal"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">Attach Document to ${consent.projectKey}: ${consent.summary}</h4>
            </div>
            <div class="modal-body">
                <input name="issueKey" value="${issue.projectKey}" id="issueKey" type="hidden">
                <input name="consentKey" value="${consent.projectKey}" id="consentKey" type="hidden">
              
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <input name="Upload" class="upload-button btn btn-default btn-primary" value="Upload" id="Upload" type="submit">
            </div>
        </g:form>
    </div>
</div>
