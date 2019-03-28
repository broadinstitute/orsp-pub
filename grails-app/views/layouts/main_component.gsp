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
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"/>

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
        createConsentGroupURL: "${createLink(controller:'newConsentGroup', action: 'save', uri: '/api/consent-group', method: 'POST')}",
        createProjectURL: "${createLink(controller:'project', action: 'save', uri: '/api/project', method: 'POST')}",
        error: "${error}",
        fillablePdfURL : "${createLink(controller: 'newConsentGroup', action: 'downloadFillablePDF', method: 'GET')}",
        getUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
        issueTypes: issueTypes,
        issueStatuses: issueStatuses,
        irbs: irbs,
        loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
        projectKey: "${params.projectKey}",
        projectType: '${params.type}',
        projectKeySearchUrl: "${createLink(controller: 'search', action: 'projectKeyAutocomplete')}",
        sampleSearchUrl: "${createLink(controller: 'consentGroup', action: 'unConsentedSampleCollections')}",
        searchUrl: "${createLink(controller: 'search', action: 'generalReactTablesJsonSearch')}",
        searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
        serverURL: "${webRequest.baseUrl}",
        userNameSearchUrl: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
      };
    </script>

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

<div id="footer">
    <div class="container">
        <g:render template="/layouts/footer" />
    </div>
</div>

<asset:deferredScripts/>
</body>
</html>
