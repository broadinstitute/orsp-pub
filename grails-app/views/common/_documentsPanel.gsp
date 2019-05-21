%{--
This template requires the following arguments:

[
    controller:          String
    issue:               Issue
    attachmentTypes:     Collection<String>
    storageDocuments:    Collection<StorageDocument>
]

--}%

<div class="panel panel-default">
    <div class="panel-heading">
        <h3>Documents</h3>
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
                                <g:select
                                        from="${attachmentTypes}"
                                        name="type"
                                        value="${attachmentTypes.get(0)}"
                                        id="type"
                                        class="chosen-select form-control"/>
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

        <div class="pull-right" style="padding-bottom: 1em;">
            <auth:isNotViewer>
            <g:if test="${!issue.isLocked() || session?.isOrsp}">
                <button class="btn btn-default btn-sm" data-toggle="modal"
                        data-target="#upload-attachment">Add Document</button>
            </g:if>
            <g:else>
                <button disabled="disabled" class="btn btn-default btn-sm">Add Document</button>
            </g:else>
            </auth:isNotViewer>
        </div>

        <table class="table table-striped table-bordered" id="all-docs">
            <thead>
            <tr>
                <th></th>
                <th>Document Type</th>
                <th>File Name</th>
                <th>Author</th>
                <th>Created</th>
            </tr>
            </thead>
            <tbody>

            <g:each in="${storageDocuments}" var="doc">
                <tr>
                    <td>
                    <auth:isNotViewer>
                        <a
                            <auth:isNotOrsp>disabled="disabled"</auth:isNotOrsp>
                            class="btn btn-danger btn-sm link-btn"
                            onclick='document.location="${createLink(controller: controller, action: 'rmAttachment', params: [id: issue.projectKey, arg: doc.id, uuid: doc.uuid])}"'>
                            Delete
                        </a>
                    </auth:isNotViewer>
                    </td>
                    <td>${doc.fileType}</td>
                    <td>
                        <a href="${createLink(controller: 'authenticated', action: 'downloadDocument', params: [uuid: doc.uuid])}"
                           target="_blank"
                           data-toggle="tooltip"
                           data-placement="top"
                           title="${doc.fileType}"
                           style="float: left;">
                            <span class="glyphicon glyphicon-download">&nbsp;</span>${doc.fileName}
                        </a>
                    </td>
                    <td>${doc.creator}</td>
                    <td>${doc.creationDate}</td>
                </tr>
            </g:each>

            </tbody>

        </table>
    </div>
</div>

<asset:script type="text/javascript">
    $(document).ready(function () {
        $.fn.dataTable.moment( 'M/D/YY H:mm A' );
        $("#all-docs").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [],
            language: { search: 'Filter:' },
            pagingType: "full_numbers",
            pageLength: 10,
            columnDefs: [ { targets: [1], type: "ticket"} ]
        });
    });

</asset:script>
