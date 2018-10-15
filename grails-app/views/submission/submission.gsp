%{--
Page expects the following:
    [issue:                     issue,
    submission:                 submission,
    docTypes:                   SUBMISSION_DOC_TYPES,
    submissionTypes:            getSubmissionTypes(issue),
    submissionNumberMaximums:   submissionNumberMaximums]

--}%
<html>
<head>
    <meta name="layout" content="main">
    <title>Submission</title>
</head>

<body>

<div class="container">

    <h2>Submission for <a
            href="${createLink(controller: issue.controller, action: 'show', params: [id: issue.projectKey, tab: 'submissions'])}">${issue.typeLabel}: ${issue.projectKey}</a>
    </h2>
    <g:if test="${issue.protocol}">
        <h3>Protocol Number: ${issue.protocol}</h3>
    </g:if>

    <div class="panel panel-default">
        <div class="panel-heading"><h3>Submission Details</h3></div>

        <div class="panel-body">

            <g:form id="submissionForm">

                <input id="submissionId" name="submissionId" value="${submission?.id}" type="hidden">
                <input id="projectKey" name="projectKey" value="${issue.projectKey}" type="hidden">

                <div class="form-group">
                    <label for="submission-type">Submission Type</label>

                    <auth:isNotOrsp>
                        <label><input disabled value="${submission?.type ?: defaultType.label}"/></label>
                        <input id="submission-type"
                               name="submissionType"
                               type="hidden"
                               value="${submission?.type ?: defaultType.label}"/>
                    </auth:isNotOrsp>

                    <auth:isOrsp>
                        <g:select
                                value="${submission?.type ?: defaultType.label}"
                                id="submission-type"
                                name="submissionType"
                                from="${submissionTypes}"
                                class="form-control"/>
                    </auth:isOrsp>
                </div>

                <div class="form-group">
                    <label for="submission-number">Submission Number</label>
                    <auth:isNotOrsp>
                        <div class="input-group">
                            ${submission?.number}
                        </div>
                    </auth:isNotOrsp>
                    <auth:isOrsp>
                        <div class="input-group spinner">
                            <input type="text" name="submissionNumber" id="submission-number" class="form-control" value="${submission?.number}">

                            <div class="input-group-btn-vertical">
                                <button class="btn btn-default"><i class="fa fa-caret-up"></i></button>
                                <button class="btn btn-default"><i class="fa fa-caret-down"></i></button>
                            </div>
                        </div>
                    </auth:isOrsp>
                </div>

                <div class="form-group">
                    <label for="submission-comments">Description</label>
                    <auth:isOrsp>
                        <textarea name="comments" id="submission-comments" class="form-control editor"
                                  rows="5">${submission?.comments}</textarea>
                    </auth:isOrsp>
                    <auth:isNotOrsp>
                        <div class="well">
                            ${submission?.comments}
                        </div>
                    </auth:isNotOrsp>
                </div>

                <auth:isOrsp>
                    <div>
                        <g:if test="${submission?.id}">
                            <div style="display: inline" class="pull-left">
                                <g:actionSubmit class="btn btn-danger"
                                                value="Delete Submission"
                                                action="delete"/>
                            </div>
                        </g:if>
                        <div style="display: inline" class="pull-right">
                            <input class="btn btn-default" type="reset" name="reset" id="reset" value="Reset"/>
                            <g:actionSubmit class="btn btn-primary" value="Save" action="save"/>
                        </div>
                    </div>
                </auth:isOrsp>

            </g:form>
        </div>
    </div>

    <g:if test="${submission}">

        <div class="panel panel-default">
            <div class="panel-heading"><h3>Files</h3></div>

            <div class="panel-body">

                <auth:isOrsp>
                    <g:uploadForm id="uploadForm">
                        <input id="submissionId" name="submissionId" value="${submission?.id}" type="hidden">
                        <input id="projectKey" name="projectKey" value="${issue.projectKey}" type="hidden">

                        <div class="form-group">
                            <label for="file-type">File Type</label>
                            <g:select
                                    id="file-type"
                                    class="form-control"
                                    from="${docTypes}"
                                    name="type"/>
                        </div>

                        <div class="form-group">
                            <div class="fileinput fileinput-new input-group" data-provides="fileinput">
                                <div class="form-control" data-trigger="fileinput"><i
                                        class="glyphicon glyphicon-file fileinput-exists"></i> <span
                                        class="fileinput-filename"></span></div>
                                <span class="input-group-addon btn btn-default btn-file"><span
                                        class="fileinput-new">Select file</span><span
                                        class="fileinput-exists">Change</span><input type="file" name="files"></span>
                                <a href="#" class="input-group-addon btn btn-default fileinput-exists"
                                   data-dismiss="fileinput">Remove</a>
                            </div>

                            <div class="pull-right"><g:actionSubmit class="btn btn-primary" value="Upload"
                                                                    action="addFile"/></div>
                        </div>
                    </g:uploadForm>
                </auth:isOrsp>

                <g:if test="${submission?.documents?.size() > 0}">
                    <div class="row">
                        <div class="col-sm-9">
                            <h4>Files</h4>
                            <table class="table table-striped table-bordered">
                                <thead>
                                <tr>
                                    <th>Type</th>
                                    <th>File Name</th>
                                    <th>Author</th>
                                    <th>Created</th>
                                    <th></th>
                                </tr>
                                </thead>
                                <tbody>

                                <g:each in="${submission?.documents}" var="document">
                                    <tr>
                                        <td>${document.fileType}</td>
                                        <td>
                                            <a href="${createLink(controller: issue.controller, action: 'downloadDocument', params: [uuid: document.uuid])}"
                                               target="_blank">${document.fileName}</a>
                                        </td>
                                        <td>${document.creator}</td>
                                        <td>${document.creationDate}</td>
                                        <td>
                                            <auth:isOrsp>
                                                <g:form>
                                                    <input type="hidden" name="uuid" value="${document.uuid}">
                                                    <input type="hidden" name="projectKey" value="${issue.projectKey}">
                                                    <input type="hidden" name="submissionId" value="${submission.id}">
                                                    <g:actionSubmit class="btn btn-danger btn-sm link-btn"
                                                                    value="Delete" action="removeFile"/>
                                                </g:form>
                                            </auth:isOrsp>
                                            <auth:isNotOrsp>
                                                <a disabled="disabled" class="btn btn-danger btn-sm link-btn">Delete</a>
                                            </auth:isNotOrsp>
                                        </td>
                                    </tr>
                                </g:each>

                                </tbody>
                            </table>
                        </div>
                    </div>
                </g:if>

            </div>

        </div>

    </g:if>

</div>

</body>
</html>

<asset:script type="text/javascript">

    $(document).ready(function() {
        let submissionNumberWidget = $('#submission-number');
        let submissionTypeWidget = $('#submission-type');
        let currentMax = 1;
        let typeMaxMap = new Map();
        <g:each in="${submissionNumberMaximums}" var="entry">typeMaxMap.set("${entry.key}", ${entry.value})
        </g:each>

        // Spinner update when submission type is changed
        submissionTypeWidget.on('change', function () {
            if (typeMaxMap.has($(this).val())) {
                currentMax = typeMaxMap.get($(this).val()) + 1;
            } else {
                currentMax = 1;
            }
            submissionNumberWidget.val(currentMax);
        });

        // Spinner and spinner validation
        $('.spinner .btn:first-of-type').on('click', function () {
            currentMax ++;
            submissionNumberWidget.val(currentMax);
            return false;
        });

        // Decrement handler
        $('.spinner .btn:last-of-type').on('click', function () {
            // Don't go negative
            if (currentMax > 0) {
                currentMax --;
                submissionNumberWidget.val(currentMax);
            }
            return false;
        });

        <g:if test="${!submission}">
        // To ensure that the right submission number is displayed for new submissions, trigger the type selection widget:
        submissionTypeWidget.trigger('change');
        </g:if>

    });

</asset:script>
