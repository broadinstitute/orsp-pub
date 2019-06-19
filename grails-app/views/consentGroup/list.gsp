%{-- This page is a view to be populated by a controller and ajax "load"-ed into a separate html component --}%
<html>

<head>
  <title>Consent Groups</title>
</head>

<body>

 <auth:isNotViewer>
   <a type="button" class="btn btn-default" href="${createLink(controller: 'newConsentGroup', action: 'show', params: [projectKey: issue.projectKey, type: issue.getController()])}" >Add New Sample/Data Cohort</a>
    <a type="button" class="btn btn-default"
        href="${createLink(controller: 'sampleConsentLink', params: [projectKey: issue.projectKey], action: 'pages')}" >
        Use existing Sample/Data Cohort</a>
 </auth:isNotViewer>

<g:if test="${consentGroups}">
    <h3>Sample/Data Cohort</h3>

    <div id="alert" class="alert alert-success" style="display:none;">
      <p>Your Consent Group was successfully submitted to the Broad Institute’s Office of Research Subject Protection.
        It will now be reviewed by the ORSP team who will reach out to you if they have any questions.</p>
    </div>

    <div class="panel-group" id="accordion" role="tablist" aria-multiselectable="true">
      <g:each in="${consentGroups}" var="consent" status="panelIndex">
        <div class="panel panel-default">
          <div class="panel-heading sample-dc" role="tab" id="heading${panelIndex}">
            <a class="pull-right">
              <span class="consent-accordion-toggle btn btn-default"><i
                  class="glyphicon glyphicon-chevron-down"></i></span>
            </a>
            <g:if test="${consent.status == 'Approved'}">
              <span class="status approved">Approved</span>
            </g:if>
            <g:if test="${consent.status != 'Approved'}">
              <span class="status pending">Pending</span>
            </g:if>

            <h3 class="panel-title">

              <auth:isNotViewer>
                <div class="cta-container">
                  <g:if test="${consent.status != 'Approved'}">
                      <button class="btn btn-default btn-sm confirmationModal" data-toggle="modal"
                      data-issue="${issue.projectKey}" data-consent="${consent.projectKey}" data-action="approve"
                      data-target="#upload-attachment"> Approve</button>       
                
                      <button class="btn btn-default btn-sm confirmationModal" data-toggle="modal"
                      data-issue="${issue.projectKey}" data-consent="${consent.projectKey}" data-action="reject"
                      data-target="#upload-attachment"> Reject</button>   
                  </g:if>
                  <g:if test="${consent.status == 'Approved'}">
                      <button class="btn btn-default btn-sm confirmationModal" data-toggle="modal"
                      data-issue="${issue.projectKey}" data-consent="${consent.projectKey}" data-action="unlink"
                      data-target="#upload-attachment"> Unlink</button> 
                  </g:if>
                </div>
              </auth:isNotViewer>
              <div class="right-container">
                <a class="request-clarification" href="/">
                  <span class="req-tooltip">
                    Request Clarification
                    <span class="arrow-down"></span>
                  </span>
                </a>

                <a class="data-name"
                  href="${createLink(controller: 'consentGroup', action: 'show', params: [id: consent.projectKey, projectKey: issue.projectKey])}">
                  ${consent.projectKey}: ${consent.summary}
                </a>
              </div>

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
                      <a href="${createLink(controller: 'irb', action: 'downloadDocument', params: [uuid: document.uuid])}"
                        target="_blank">${document.fileName}</a>
                    </td>
                    <td>${document.creator}</td>
                    <td>${document.creationDate}</td>
                  </tr>
                </g:each>

              </tbody>

              <tfoot>
                <tr class="text-right">
                  <auth:isNotViewer>
                    <td colspan="5">
                      <g:if test="${!issue.isLocked() || session?.isOrsp}">
                        <button class="btn btn-default btn-sm modal-add-button" data-toggle="modal"
                          data-issue="${issue.projectKey}" data-consent="${consent.projectKey}"
                          data-target="#upload-attachment">Add Consent Attachment</button>
                      </g:if>
                      <g:else>
                        <button disabled="disabled" class="btn btn-default btn-sm">Add Attachment</button>
                      </g:else>
                    </td>
                  </auth:isNotViewer>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>

      </g:each>
    </div>
    %{-- Modal container to upload a consent group attachment type from within a project --}%
    <div class="modal" id="add-consent-document-modal" tabindex="-1" role="dialog"
      aria-labelledby="addConsentDocumentModalDialog" aria-hidden="true">
    </div>

      %{-- Modal container to confirm approve / reject / unlink --}%
      <div class="modal" id="confirmation-modal-dialog" tabindex="-1" role="dialog"
        aria-labelledby="confirmationModalDialog" aria-hidden="true">
      </div>
  </g:if>

</body>

</html>


<script>
  // Display for 8 seconds a message indicating the submission of a new consent group. This is temporary until this page is moved to react.
  $(document).ready(function () {
    var url = new URLSearchParams(window.location.search);
    if (url.get('tab') === 'consent-groups' && url.has('new')) {
      $('#alert').fadeIn('slow', function () {
        $('#alert').delay(8000).fadeOut();
        history.pushState({}, null, window.location.href.split('&')[0]);
      });
    }
  });
</script>