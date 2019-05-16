%{-- This page is a view to be populated by a controller and ajax "load"-ed into a separate html component --}%
<html>
<head>
    <title>Consent Groups</title>
</head>

<body>

<button class="btn btn-default" data-toggle="modal" data-target=".add-new-consent-modal">Add Consent Group</button>
<a type="button" class="btn btn-default" style="color: blue" href="${createLink(controller: 'newConsentGroup', action: 'show', params: [projectKey: issue.projectKey, type: issue.getController()])}" >Add New Sample/Data Cohort</a>
<button class="btn btn-default" data-toggle="modal" data-target=".use-existing-consent-modal">Use Existing Consent Group</button>

<g:if test="${consentGroups}">
    <h3>Consent Groups</h3>

    <div id="alert" class="alert alert-success" style="display:none;" >
        <p>Your Consent Group was successfully submitted to the Broad Institute’s Office of Research Subject Protection. It will now be reviewed by the ORSP team who will reach out to you if they have any questions.</p>
    </div>

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
                            <th>Info Link</th>
                        </tr>
                        </thead>
                        <tbody>

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
                                <td>
                                    <a href="${createLink(controller: 'infoLink', action: 'showInfoLink', params: [id: consent.projectKey, projectKey: issue.projectKey])}">Info Link</a>
                                </td>
                            </tr>
                        </g:each>

                        </tbody>

                        <tfoot>
                        <tr class="text-right">
                            <td colspan="6">
                                <g:if test="${!issue.isLocked() || session?.isOrsp}">
                                    <button class="btn btn-default btn-sm modal-add-button"
                                            data-toggle="modal"
                                            data-issue="${issue.projectKey}"
                                            data-consent="${consent.projectKey}"
                                            data-target="#upload-attachment">Add Consent Attachment</button>
                                </g:if>
                                <g:else>
                                    <button disabled="disabled" class="btn btn-default btn-sm">Add Attachment</button>
                                </g:else>
                            </td>
                        </tr>
                        </tfoot>
                    </table>
                </div>
            </div>

        </g:each>
    </div>
</g:if>

</body>
</html>


<script>
// Display for 8 seconds a message indicating the submission of a new consent group. This is temporary until this page is moved to react.
    $( document ).ready(function(){
        var url = new URLSearchParams(window.location.search);
        if (url.get('tab') === 'consent-groups' && url.has('new')) {
            $('#alert').fadeIn('slow', function(){
                   $('#alert').delay(8000).fadeOut();
                   history.pushState({}, null, window.location.href.split('&')[0]);
            });
        }
    });
</script>
