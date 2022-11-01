<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>
<%@ page import="grails.util.Environment" %>

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

    <link rel="shortcut icon" href="${resource(dir: 'assets', file: 'favicon.png')}" type="image/x-icon">
    <link rel="apple-touch-icon" href="${resource(dir: 'assets', file: 'apple-touch-icon.png')}">
    <link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'images', file: 'apple-touch-icon-retina.png')}">
    <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css" />
    <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
    <asset:stylesheet src="bootstrap-customizations.css"/>
    <asset:stylesheet src="jasny-bootstrap.min.css"/>
    %{-- We need this custom table tools css file to override display issues with cdn version --}%
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css"/>
    <!--Bootstrap 5 CSS only -->
    <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/css/bootstrap.min.css" integrity="sha384-ggOyR0iXCbMQv3Xipma34MD+dH/1fQ784/j6cY/iJTQUOhcWr7x9JvoRxT2MZw1T" crossorigin="anonymous">

    <asset:stylesheet src="jquery.dataTables.css"/>
    <asset:stylesheet src="style.css"/>
    <style type="text/css" title="TableTools">
    @import "${request.contextPath}/assets/media/css/TableTools.css";
    </style>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>
    <!--Bootstrap JavaScript -->
    <script src="https://code.jquery.com/jquery-3.3.1.slim.min.js" integrity="sha384-q8i/X+965DzO0rT7abK41JStQIAqVgRVzpbzo5smXKp4YfRvH+8abtTE1Pi6jizo" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/popper.js@1.14.7/dist/umd/popper.min.js" integrity="sha384-UO2eT0CpHqdSJQ6hJty5KVphtPhzWj9WO1clHTMGa3JDZwrnQq4sF86dIHNDz0W1" crossorigin="anonymous"></script>
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@4.3.1/dist/js/bootstrap.min.js" integrity="sha384-JjSmVgyd0p3pXB1rRibZUAYoIIy6OrQ6VrjIEaFf/nJGzIxFDsf4x0xIM+B07jRM" crossorigin="anonymous"></script>

    %{--
       Add all react component based code here.
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

      // React Component dependencies that derive from native GSP/Grails functionality should be defined here.

      const component = {
        issueTypes: issueTypes,
        issueStatuses: issueStatuses,
        irbs: irbs,
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
        isBroad:  ${session.isBroad ? session.isBroad : false},
        clientId: "${grailsApplication.config.googleSignInClientId}",
        env: "${Environment.current.name}"
      };
    </script>
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="https://cloud.tinymce.com/5/tinymce.min.js?apiKey=kyknyn3xmeam53u8vyway2oxf18oecyfwkjoym1xcydpyfyh"></script>

    <g:layoutHead/>
</head>
<body style="margin-top: 0; padding-top: 70px;">
<div id="main"></div>
<asset:javascript src="build/mainIndex.js"/>
<asset:javascript src="chosen.jquery.min.js"/>
</body>
</html>
