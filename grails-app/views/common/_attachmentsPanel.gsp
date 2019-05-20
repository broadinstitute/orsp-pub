%{--
This template requires the following arguments:

[
    attachments
    issue
    controller
    attachmentTypes
]

--}%

<div class="panel panel-default">
    <div class="panel-heading">
        <h3 class="panel-title">Additional Documents</h3>
    </div>

    <div class="panel-body">

        <div class="modal fade upload-attachment-modal" id="upload-attachment" tabindex="-1" role="dialog"
             aria-labelledby="uploadAttachmentModalDialog" aria-hidden="true">
            <div class="modal-dialog modal-lg">
                <div class="modal-content">
                    <g:form controller="${controller}" action="attachDocument" enctype="multipart/form-data"
                            method="POST">
                        <div class="modal-header panel-heading">
                            <button type="button" class="close" data-dismiss="modal"><span
                                    aria-hidden="true">&times;</span><span class="sr-only">Close</span></button>
                            <h4 class="modal-title">Attach Document to ${issue.projectKey}: ${issue.summary}</h4>
                        </div>

                        <div class="modal-body">
                            <input name="id" value="${issue.projectKey}" id="id" type="hidden">

                            <div class="form-group">
                                <label for="type">Type</label>
                                <select name="type" id="type" class="chosen-select form-control">
                                    <g:each in="${attachmentTypes}" var="type"><option
                                            value="${type}">${type}</option></g:each>
                                </select>
                            </div>

                            <div class="fileinput fileinput-new input-group" data-provides="fileinput">
                                <div class="form-control" data-trigger="fileinput"><i
                                        class="glyphicon glyphicon-file fileinput-exists"></i> <span
                                        class="fileinput-filename"></span></div>
                                <span class="input-group-addon btn btn-default btn-file"><span
                                        class="fileinput-new">Select file</span><span
                                        class="fileinput-exists">Change</span><input type="file" name="files"
                                                                                     multiple="multiple"></span>
                                <a href="#" class="input-group-addon btn btn-default fileinput-exists"
                                   data-dismiss="fileinput">Remove</a>
                            </div>

                        </div>

                        <div class="modal-footer">
                            <button type="button" class="btn btn-default" data-dismiss="modal">Cancel</button>
                            <input name="Upload" class="upload-button btn btn-default btn-primary"
                                   value="Upload" id="Upload" type="submit">
                        </div>
                    </g:form>
                </div>
            </div>
        </div>

        <table class="table table-striped table-bordered" id="attachments-table">
            <thead>
            <tr>
                <th></th>
                <th>Attachment Type</th>
                <th>File Name</th>
                <th>Author</th>
                <th>Created</th>
            </tr>
            </thead>
            <tbody>

            <g:each in="${attachments}" var="item">
                <tr>
                    <td>
                        <auth:isOrsp>
                            <a href="${createLink(controller: controller, action: 'rmAttachment', params: [id: issue.projectKey, arg: item.id, uuid: item.uuid])}"
                               class="btn btn-default btn-xs">
                                Delete
                            </a>
                        </auth:isOrsp>
                        <auth:isNotAdmin>
                            <button disabled="disabled" class="btn btn-default btn-xs">Delete</button>
                        </auth:isNotAdmin>
                    </td>
                    <td>${item.fileType}</td>
                    <td>
                        <a href="${createLink(controller: controller, action: 'downloadDocument', params: [uuid: item.uuid])}" target="_blank">${item.fileName}</a>
                    </td>
                    <td>${item.creator}</td>
                    <td>${item.creationDate}</td>
                </tr>
            </g:each>

            </tbody>

            <g:if test="${attachmentTypes}">
                <tfoot>

                <tr class="text-right">
                  <auth:isNotViewer>
                    <td colspan="5">
                        <g:if test="${!issue.isLocked() || session?.isOrsp}">
                            <button class="btn btn-default btn-sm" data-toggle="modal"
                                    data-target="#upload-attachment">Add Attachment</button>
                        </g:if>
                        <g:else>
                            <button disabled="disabled" class="btn btn-default btn-sm">Add Attachment</button>
                        </g:else>
                    </td>
                  </auth:isNotViewer>
                </tr>
                </tfoot>
            </g:if>

        </table>
    </div>
</div>

<asset:script type="text/javascript">
    $(document).ready(function () {
        $.fn.dataTable.moment( 'M/D/YY H:mm A' );
        $("#attachments-table").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [],
            language: { search: 'Filter:' },
            paging: false,
            order: [[ 4, "desc" ]]
        });
    });

</asset:script>
