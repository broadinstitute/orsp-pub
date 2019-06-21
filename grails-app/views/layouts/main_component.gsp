<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>

<!DOCTYPE html>
<html>
<head>
    <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
    <meta http-equiv="X-UA-Compatible" content="IE=Edge">
    <title><g:layoutTitle default="ORSP Portal"/></title>
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="description" content="ORSP Portal">
    <meta name="author" content="ORSP">
    <meta name="google-signin-client_id" content="${grailsApplication.config.googleSignInClientId}">
    <meta charset="utf-8"/>

    <link rel="shortcut icon" href="${resource(dir: 'assets', file: 'favicon.ico')}" type="image/x-icon">
    <link rel="apple-touch-icon" href="${resource(dir: 'assets', file: 'apple-touch-icon.png')}">
    <link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'images', file: 'apple-touch-icon-retina.png')}">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css" />
    <asset:stylesheet src="chosen/chosen.css"/>
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
    <asset:stylesheet src="bootstrap-customizations.css"/>
    <asset:stylesheet src="jasny-bootstrap.min.css"/>
    <link rel="stylesheet" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">
    <link rel="stylesheet" href="//cdn.datatables.net/tabletools/2.2.3/css/dataTables.tableTools.css">
    %{-- We need this custom table tools css file to override display issues with cdn version --}%
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"/>

    <asset:stylesheet src="jquery.dataTables.css"/>
    <asset:stylesheet src="style.css"/>
    <style type="text/css" title="TableTools">
    @import "${request.contextPath}/assets/media/css/TableTools.css";
    .ui-autocomplete-loading {
        background: white url('${request.contextPath}/assets/spinner.gif') right center no-repeat;
    }
    @media (min-width: 765px) and (max-width: 1200px) {
        body {
            margin-top: 110px;
        }
    }
    </style>
    <script src="https://apis.google.com/js/platform.js" async defer></script>

    <script>
      if (location.protocol !== "https:") location.protocol = "https:";
      function onSignIn(googleUser) {
        // show spinner while the page is re-loading
        document.getElementById("login_spinner").setAttribute("class", "visible");
        let profile = googleUser.getBasicProfile();
        let token = googleUser.getAuthResponse().id_token;
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.then(function() {
          let xhttp = new XMLHttpRequest();

          %{--
              This is here so that after a Broad user signs in, their page is refreshed with valid content
              Overwrites previous onreadystatechange
          --}%
          <auth:isNotAuthenticated>
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              location.reload();
            }
          };
          </auth:isNotAuthenticated>
          let url = "${raw(createLink(controller: "auth", action: "authUser"))}";
          let postData = "token=" + token;
          xhttp.open("POST", url, true);
          xhttp.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
          xhttp.send(postData);
        });
      }
      function signOut() {
        let auth2 = gapi.auth2.getAuthInstance();
        auth2.signOut().then(function (){
          let xhttp = new XMLHttpRequest();
          xhttp.onreadystatechange = function() {
            if (this.readyState == 4 && this.status == 200) {
              window.location = "${request.contextPath}";
            }
          };
          let url = "${raw(createLink(controller: "logout", action: "logout"))}";
          xhttp.open("POST", url, true);
          xhttp.send();
        });
      }
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>

    %{--
       Add all react component based code here.
       TODO: These constants should all be refactored into a static utility class
    --}%
    <script type="application/javascript">
      const issueTypes = [
        <g:each status="count" in="${IssueType.values()}" var="type">"${raw(type.name)}"<g:if test="${count < IssueType.values().size() - 1}">,</g:if>
        </g:each>];

      const issueStatuses = [
        <g:each status="count" in="${IssueStatus.values().sort{it.sequence}}" var="status">"${raw(status.name)}"<g:if test="${count < IssueStatus.values().size() - 1}">,</g:if>
        </g:each>];

      const irbs = [
          <g:each status="count" in="${PreferredIrb.values()}" var="map">{ id:"${raw(map.key)}", value:"${raw(map.label)}"}<g:if test="${count < PreferredIrb.values().size() - 1}">,</g:if>
        </g:each>];

      // TODO: Many of these should be static values directly accessible from the components directly.
      // Look into moving these values out of
      // React Component dependencies that derive from native GSP/Grails functionality should be defined here.
      const component = {
        attachDocumentsURL: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
        consentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'findByUUID')}",
        consentNamesSearchURL: "${createLink(controller: 'consentGroup', action: 'consentGroupSummaries')}",
        consentGroupsUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroups')}",
        createConsentGroupURL: "${createLink(controller:'newConsentGroup', action: 'save', uri: '/api/consent-group', method: 'POST')}",
        createProjectURL: "${createLink(controller:'project', action: 'save', uri: '/api/project', method: 'POST')}",
        error: "${error}",
        fillablePdfURL : "${createLink(controller: 'newConsentGroup', action: 'downloadFillablePDF', method: 'GET')}",
        getUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
        issueTypes: issueTypes,
        issueStatuses: issueStatuses,
        irbs: irbs,
        loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
        projectKey: "${projectKey}",
        issueType: "${issueType}",
        tab: "${params.tab}",
        consentKey: "${consentKey}",
        projectType: '${params.type}',
        projectKeySearchUrl: "${createLink(controller: 'search', action: 'projectKeyAutocomplete')}",
        sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
        searchUrl: "${createLink(controller: 'search', action: 'generalReactTablesJsonSearch')}",
        searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
        serverURL: "${webRequest.baseUrl}",
        userNameSearchUrl: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
        sourceDiseases: "${createLink(controller: 'search', action: 'getMatchingDiseaseOntologies')}",
        isAdmin: ${session.isAdmin},
        isViewer: "${session.isViewer}",
        rejectProjectUrl: "${createLink(controller: 'project', action: 'delete')}",
        updateProjectUrl: "${createLink(controller: 'project', action: 'update')}",
        discardReviewUrl: "${createLink(controller: 'issueReview', action: 'delete')}",
        clarificationUrl: "${createLink(controller: 'clarification', action: 'addClarificationRequest', method: 'POST')}",
        searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
        projectUrl: "${createLink(controller: 'project', action: 'getProject')}",
        saveExtraPropUrl: "${createLink(controller: 'project', action: 'modifyExtraProperties')}",
        unlinkedSampleCollectionsUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
        linkedSampleCollectionsUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroupSampleCollections')}",
        attachedDocumentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
        rejectDocumentUrl: "${createLink(uri: '/api/files-helper/reject-document', 'PUT')}",
        approveDocumentUrl: "${createLink(uri: '/api/files-helper/approve-document', method: 'PUT')}",
        downloadDocumentUrl: "${createLink(controller: 'authenticated', action: 'downloadDocument')}",
        sessionUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
        removeDocumentUrl: "${createLink(uri: '/api/files-helper/delete', 'DELETE')}",
        updateAdminOnlyPropsUrl: "${createLink(controller: 'project', action: 'updateAdminOnlyProps')}",
        attachmentsUrl: "${createLink(uri: '/api/files-helper/attached-documents', method: 'GET')}",
        emailDulUrl: "${createLink(uri: '/api/dul-email-notification')}",
        useRestrictionUrl: "${createLink(controller:'newConsentGroup', action: 'getDataUseRestriction')}",
        isAdminUrl: "${createLink(controller: 'authenticated', action: 'isCurrentUserAdmin')}",
        rejectConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'delete')}",
        updateConsentUrl: "${createLink(controller: 'newConsentGroup', action: 'update')}",
        approveConsentGroupUrl: "${createLink(controller: 'newConsentGroup', action: 'approveConsentGroup')}",     
        consentGroupReviewUrl: "${createLink(controller: 'consentGroup', action: 'getConsentGroup')}",
        createRestrictionUrl: "${createLink(controller: 'dataUse', action: 'create')}"
      };
    </script>

    %{-- Set context path for all scripts to use --}%
    <script type="text/javascript">
      window.appContext = '${request.contextPath}';
    </script>

    %{-- TODO: A lot of this code should go away once react conversion is complete --}%
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="//cdn.datatables.net/1.10.16/js/jquery.dataTables.min.js"></script>
    <script src="//cdn.datatables.net/buttons/1.5.1/js/dataTables.buttons.min.js"></script>
    <script src="//cdn.datatables.net/buttons/1.5.1/js/buttons.flash.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/jszip/3.1.3/jszip.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/pdfmake.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/pdfmake/0.1.32/vfs_fonts.js"></script>
    <script src="//cdn.datatables.net/buttons/1.5.1/js/buttons.html5.min.js"></script>
    <script src="//cdn.datatables.net/buttons/1.5.1/js/buttons.print.min.js"></script>
    <script src="//cdnjs.cloudflare.com/ajax/libs/moment.js/2.8.4/moment.min.js"></script>
    <script src="//cdn.datatables.net/plug-ins/1.10.19/sorting/datetime-moment.js"></script>
    <script src="https://cloud.tinymce.com/5/tinymce.min.js?apiKey=8zknubfnjvv9l3sg0cpxrome1qk6r2wlpdw7j4ebb3gjxige"></script>

    <g:layoutHead/>
</head>
<body>
<g:render template="/base/topNav" />

<auth:isNotAuthenticated>
    <div class="container">
        <div id="login_spinner" class="hidden">
            <div class="alert alert-success alert-dismissable" style="display: block">
                Loading ... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
            </div>
        </div>
        <h3>About the ORSP Portal</h3>
        <g:render template="/index/aboutBlurb"/>
    </div>
</auth:isNotAuthenticated>

<auth:nonBroadSession>
    <div class="container">
        <div class="alert alert-danger alert-dismissable" style="display: block">
            You must be a Broad Institute User for further access. Please sign out and log in with
            a "broadinstitute.org" email account.
        </div>
        <h3>About the ORSP Portal</h3>
        <g:render template="/index/aboutBlurb"/>
    </div>
</auth:nonBroadSession>

<auth:broadSession>
    <div class="container">
        <g:render template="/base/messages" />
        <g:layoutBody/>
    </div>
</auth:broadSession>

<div id="footer"></div>
<asset:javascript src="build/footer.js"/>


%{-- TODO: A lot of this code should go away once react conversion is complete --}%
<asset:javascript src="jquery.fn.dataTablesExt.ticket.js"/>
<asset:javascript src="jquery.fn.dataTablesExt.ticket.js"/>
<asset:javascript src="chosen.jquery.min.js"/>
<asset:javascript src="jasny-bootstrap.min.js"/>
<asset:javascript src="jquery.validate.min.js"/>
<asset:javascript src="jsrender.js"/>

<asset:javascript src="jquery.file.upload-9.9.2/js/vendor/jquery.ui.widget.js"/>
<asset:javascript src="jquery.file.upload-9.9.2/js/jquery.iframe-transport.js"/>
<asset:javascript src="jquery.file.upload-9.9.2/js/jquery.fileupload.js"/>

<script type="text/javascript">
  $(document).ready(function () {
    $(".chosen-select").chosen({width: "100%"});
    initializeEditor();
    $('[data-toggle="tooltip"]').tooltip();
  });

  function initializeEditor() {
    tinymce.init({
      selector:'textarea.editor',
      width: '100%',
      menubar: false,
      statusbar: false,
      plugins: "paste",
      paste_data_images: false
    });
  }

  function loadComments(url) {
    $("#comments").load(
      url,
      function() {
        $.fn.dataTable.moment( 'MM/DD/YYYY hh:mm:ss' );
        $("#comments-table").DataTable({
          dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
          buttons: [ 'excelHtml5', 'csvHtml5', 'print' ],
          language: { search: 'Filter:' },
          pagingType: "full_numbers",
          order: [1, "desc"]
        });
        initializeEditor();
      }
    );
  }

  function loadHistory(url) {
    $("#history").load(
      url,
      function() {
        $.fn.dataTable.moment( 'MM/DD/YYYY hh:mm:ss' );
        $("#history-table").DataTable({
          dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
          buttons: [ 'excelHtml5', 'csvHtml5', 'print' ],
          language: { search: 'Filter:' },
          pagingType: "full_numbers",
          order: [1, "desc"]
        });
      }
    );
  }

  // Toggle pattern for Jira-style objects. Relies on "-id" naming pattern
  function toggleContinueMessage(elementId, val1, val2) {
    $("input[name='" + elementId + "-id'], input[name='" + elementId + "']").change(
      function() {
        if ($(this).val() === val1) {
          $('*[data-id="' + val1 + '"]').show();
          $('*[data-id="' + val2 + '"]').hide();
        } else {
          $('*[data-id="' + val1 + '"]').hide();
          $('*[data-id="' + val2 + '"]').show();
        }
      }
    );
  }

  // Toggle pattern for property style objects. Slightly different from Jira-style objects.
  function togglePropertyMessage(elementName, val1, val2) {
    $("input[name='" + elementName + "']").change(
      function() {
        prop1Message = $('*[data-id="' + elementName + "." + val1 + '"]');
        prop2Message = $('*[data-id="' + elementName + "." + val2 + '"]');
        if ($(this).val() === val1) {
          prop1Message.show();
          prop2Message.hide();
        } else {
          prop1Message.hide();
          prop2Message.show();
        }
      }
    );
  }

</script>

<script id="uploadedFileTemplate" type="text/x-jsrender">
<div class="alert alert-success" role="alert" id="{{:fileUuid}}">
    <i class="fa {{:icon}}"></i>
    <span style="padding-left: 10px;">{{:type}}: {{:name}}</span>
    <i class="btn btn-danger fa fa-trash pull-right" onclick="removeDocument('{{:fileUuid}}', '{{:amendmentId}}');"></i>
</div>
</script>

<asset:javascript src="application.js"/>

<g:if test="${tab}">
    <asset:script type="text/javascript">
        $(document).ready(function () {
            $('a[href="#${tab}"]').click();
    });
    </asset:script>
</g:if>

<asset:deferredScripts/>
</body>
</html>
