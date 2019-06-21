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
        <g:form controller="clarification" action="collectionRequestClarification" method="POST">
            <div class="modal-header panel-heading">
                <button type="button" class="close" data-dismiss="modal" style="outline:none"><span aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                <h4 class="modal-title">Request Clarification on ${issue.projectKey}</h4>
            </div>
            <input name="id" value="${issue.projectKey}" id="id" type="hidden">
            <input name="type" value="link" id="type" type="hidden">

            <div class="modal-body">
                    <div class="inputField">
                        <p class="inputFieldLabel">Please describe the clarification you are requesting</p>
                        <div class="inputFieldWrapper">
                            <textarea required oninvalid="this.setCustomValidity('Required field')" name="comment" id="comment" rows="5" class="form-control inputFieldTextarea" style="resize: none"></textarea>
                        </div>
                    </div>

                    <div class="form-group" style="margin-top: 20px">
                        <label class="inputFieldLabel" for="projectMember">Project Member</label>
                        <span class="badge addProjectMember inputFieldWrapper"></span>
                        <input required oninvalid="this.setCustomValidity('Required field')" type="text" value="" id="projectMember" name="projectMember" class="form-control userAutocomplete"/>
                        <input type="hidden" name="pm"/>
                    </div>
            </div>
            <div class="modal-footer">
                <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                <input name="requestClarification" class="btn btn-primary" value="Request Clarification" id="rc" type="submit">
            </div>
        </g:form>
    </div>
</div>

<!-- Fix autocomplete Dropdown under: Request Clarification Modal -->
<style>
.ui-autocomplete.ui-front.ui-menu.ui-widget.ui-widget-content {
    z-index: 1500;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 300px;
}

.ui-dialog.ui-widget.ui-corner-all.ui-front {
    overflow: visible;
}
</style>
