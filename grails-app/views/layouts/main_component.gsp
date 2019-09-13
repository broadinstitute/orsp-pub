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
    </style>
    <script>
      if (location.protocol !== "https:") location.protocol = "https:";
    </script>

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
        issueTypes: issueTypes,
        issueStatuses: issueStatuses,
        irbs: irbs,
        loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
        projectKey: "${projectKey}",
        issueType: "${issueType}",
        restrictionId: "${restrictionId}",
        tab: "${params.tab}",
        consentKey: "${consentKey}",
        projectType: '${params.type}',
        serverURL: "${grailsApplication.config.grails.serverURL}",
        contextPath: "${request.contextPath}",
        isAdmin: ${session.isAdmin ? session.isAdmin : false},
        isViewer: ${session.isViewer ? session.isViewer : false},
        clientId: "${grailsApplication.config.googleSignInClientId}"

      };
    </script>

    %{-- Set context path for all scripts to use --}%
    <script type="text/javascript">
      window.appContext = '${request.contextPath}';
    </script>
    <g:layoutHead/>
</head>
<body style="margin-top: 0; padding-top: 70px;">

  <div id="main"></div>
  <asset:javascript src="build/mainIndex.js"/>

<asset:javascript src="application.js"/>
<asset:deferredScripts/>
</body>
</html>
