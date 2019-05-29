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
                <h4 class="modal-title">Attach Document to ver ${consent.projectKey}: ${consent.summary}</h4>
            </div>
            <div class="modal-body">
                <input name="issueKey" value="${issue.projectKey}" id="issueKey" type="hidden">
                <input name="consentKey" value="${consent.projectKey}" id="consentKey" type="hidden">
                <div class="form-group">
                    <label for="type">Type</label>
                    <select name="type" id="type" class="chosen-select form-control">
                        <g:each in="${attachmentTypes}" var="attachmentType">
                            <option value="${attachmentType}">${attachmentType}</option>
                        </g:each>
                    </select>
                </div>
                <div class="fileinput fileinput-new input-group" data-provides="fileinput">
                    <div class="form-control" data-trigger="fileinput"><i class="glyphicon glyphicon-file fileinput-exists"></i> <span class="fileinput-filename"></span></div>
                    <span class="input-group-addon btn btn-default btn-file"><span class="fileinput-new">Select file</span><span class="fileinput-exists">Change</span><input type="file" name="files" multiple="multiple"></span>
                    <a href="#" class="input-group-addon btn btn-default fileinput-exists" data-dismiss="fileinput">Remove</a>
                </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <input name="Upload" class="upload-button btn btn-default btn-primary" value="Upload" id="Upload" type="submit">
            </div>
        </g:form>
    </div>
</div>
