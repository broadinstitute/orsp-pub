%{-- This page is a view to be populated by a controller and ajax "load"-ed into a separate html component --}%
<html>
<head>
    <title>Consent Groups</title>
</head>

<body>

<button class="btn btn-default" data-toggle="modal" data-target=".add-new-consent-modal">Add Consent Group</button>
<a type="button" class="btn btn-default" style="color: blue" href="${createLink(controller: 'newConsentGroup', action: 'show', params: [projectKey: issue.projectKey, type: issue.getController()])}" >New Add Consent Group</a>
<button class="btn btn-default" data-toggle="modal" data-target=".use-existing-consent-modal">Use Existing Consent Group</button>

<g:if test="${consentGroups}">
    <h3>Consent Groups</h3>
    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
        <g:each in="${consentGroups}" var="consent" status="panelIndex">
            <div class="panel panel-default">
                <div class="panel-heading" role="tab" id="heading${panelIndex}">
                    <a class="pull-right"
                       href="#">
                        <span class="consent-accordion-toggle btn btn-default"><i class="glyphicon glyphicon-chevron-down"></i></span>
                    </a>
                    <h3 class="panel-title">
                        <a class="btn btn-default btn-sm" style="margin-right: 15px;"
                           href="${createLink(controller: 'consentGroup', action: 'breakLink', params: [projectKey: issue.projectKey, consentKey: consent.projectKey])}">
                            Unlink
                        </a>

                        Consent Group
                        <a href="${createLink(controller: 'consentGroup', action: 'show', params: [id: consent.projectKey, projectKey: issue.projectKey])}">
                            ${consent.projectKey}: ${consent.summary}
                        </a>

                    </h3>
                </div>
                <div class="panel-body consent-group-panel-body">

                    <table class="table table-bordered table-striped">
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

                        <g:each in="${consent.nonProjAttachTypes()}" var="type" status="index">
                            <tr>
                                <td>
                                    <button
                                            class="btn btn-default btn-xs modal-add-button"
                                            data-issue="${issue.projectKey}"
                                            data-consent="${consent.projectKey}"
                                            data-type="${type}">
                                        Add
                                    </button>
                                </td>
                                <td>${type}</td>
                                <td></td>
                                <td></td>
                                <td></td>
                            </tr>
                        </g:each>

                        <g:each in="${consent.attachments?.sort {a,b -> b.createDate <=> a.createDate}}" var="document">
                            <tr>
                                <td>
                                    <auth:isOrsp>
                                        <a href="${createLink(controller: 'irb', action: 'rmAttachment', params: [id: issue.projectKey, uuid: document.uuid])}"
                                           class="btn btn-default btn-xs link-btn">
                                            Delete
                                        </a>
                                    </auth:isOrsp>
                                    <auth:isNotAdmin>
                                        <button disabled="disabled" class="btn btn-default btn-xs link-btn">Delete</button>
                                    </auth:isNotAdmin>
                                </td>
                                <td>${document.fileType}</td>
                                <td>
                                    <a href="${createLink(controller: 'irb', action: 'downloadDocument', params: [uuid: document.uuid])}" target="_blank">${document.fileName}</a>
                                </td>
                                <td>${document.creator}</td>
                                <td>${document.creationDate}</td>
                            </tr>
                        </g:each>

                        </tbody>
                    </table>
                </div>
            </div>

        </g:each>
    </div>
</g:if>

</body>
</html>