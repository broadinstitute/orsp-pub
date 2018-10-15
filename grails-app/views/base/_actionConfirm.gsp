<g:if test="${active}">
    <g:set var="myId" value="${baseId++}"/>

    <div class="btn btn-default" id="confirm_button_${myId}">
        <asset:script type="text/javascript">
            $(document).ready(function () {
                $("#confirm_button_${myId}").click(function() {
                    $("#confirm_modal_${myId}").dialog({
                        modal: true,
                        title: "Please Confirm",
                        minWidth: 600,
                        minHeight: 300,
                        closeOnEscape: true,
                        close: function () {
                            $("#confirm_modal_${myId}").dialog("close");
                        }
                    });
                });
                $("#confirm_modal_submit_${myId}").click(function() {
                    this.form.submit();
                    $("#confirm_modal_${myId}").dialog("close");
                });
                $("#confirm_modal_cancel_${myId}").click(function() {
                    $("#confirm_modal_${myId}").dialog("close");
                });
            });
        </asset:script>

        <span style="color: white;">${label}</span>

        <div id="confirm_modal_${myId}" style="display: none;">
            <h4>Please Confirm</h4>
            <div class="well">${message ?: label}</div>
            <g:form url="${url}">
                <g:hiddenField name="id" value="${issue.projectKey}"/>
                <div style="width: 100%;">
                    <p>Optional Comment</p>
                    <g:textArea name="comment" style="width: 100%;"/>
                </div>

                <div class="pull-right" style="padding-top: 10px">
                    <button type="button" id="confirm_modal_submit_${myId}"
                            class="btn btn-default submit">${label}</button>
                    <button type="button" id="confirm_modal_cancel_${myId}"
                            class="btn btn-default cancel">Cancel</button>
                </div>
            </g:form>
        </div>

    </div>

</g:if>
<g:else>
    <button disabled="disabled" class="btn btn-default">${label}</button>
</g:else>
