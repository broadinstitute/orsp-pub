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
    <meta name="google-signin-client_id" content="${grailsApplication.config.googleSignInClientId}">
    <meta charset="utf-8"/>

    <link rel="shortcut icon" href="${resource(dir: 'assets', file: 'favicon.png')}" type="image/x-icon">
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
        background: white url('${request.contextPath}/assets/spinner.gif') right 10px center no-repeat;
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
        isBroad:  ${session.isBroad ? session.isBroad : false},
        clientId: "${grailsApplication.config.googleSignInClientId}",
        env: "${Environment.current.name}"
      };
    </script>

    %{-- TODO: A lot of this code should go away once react conversion is complete --}%
    <script src="//ajax.googleapis.com/ajax/libs/jquery/2.1.3/jquery.min.js"></script>
    <script src="//ajax.googleapis.com/ajax/libs/jqueryui/1.11.2/jquery-ui.min.js"></script>
    <script src="//maxcdn.bootstrapcdn.com/bootstrap/3.3.6/js/bootstrap.min.js"></script>
    <script src="https://cloud.tinymce.com/5/tinymce.min.js?apiKey=kyknyn3xmeam53u8vyway2oxf18oecyfwkjoym1xcydpyfyh"></script>

    <g:layoutHead/>
</head>
<body style="margin-top: 0; padding-top: 70px;">
 <div id="main"></div>
    <asset:javascript src="build/mainIndex.js"/>




%{-- TODO: A lot of this code should go away once react conversion is complete --}%
<asset:javascript src="chosen.jquery.min.js"/>
<asset:javascript src="jasny-bootstrap.min.js"/>
<asset:javascript src="jquery.validate.min.js"/>
<asset:javascript src="jsrender.js"/>

<script type="text/javascript">
  $(document).ready(function () {
    $(".chosen-select").chosen({width: "100%"});

    $('[data-toggle="tooltip"]').tooltip();
  });


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
