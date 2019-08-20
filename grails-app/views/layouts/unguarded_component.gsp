<!DOCTYPE html>
<html>

<head>
  <meta http-equiv="Content-Type" content="text/html; charset=UTF-8">
  <meta http-equiv="X-UA-Compatible" content="IE=Edge">
  <title>
    <g:layoutTitle default="ORSP Portal" />
  </title>
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <meta name="description" content="ORSP Portal">
  <link rel="shortcut icon" href="${resource(dir: 'assets', file: 'favicon.ico')}" type="image/x-icon">
  <link rel="apple-touch-icon" href="${resource(dir: 'assets', file: 'apple-touch-icon.png')}">
  <link rel="apple-touch-icon" sizes="114x114" href="${resource(dir: 'images', file: 'apple-touch-icon-retina.png')}">
  <link rel="stylesheet" href="//code.jquery.com/ui/1.11.2/themes/smoothness/jquery-ui.css" />
  <asset:stylesheet src="chosen/chosen.css" />
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/bootstrap/3.3.2/css/bootstrap.min.css">
  <link rel="stylesheet" href="//maxcdn.bootstrapcdn.com/font-awesome/4.2.0/css/font-awesome.min.css">
  <asset:stylesheet src="bootstrap-customizations.css" />
  <asset:stylesheet src="jasny-bootstrap.min.css" />
  <link rel="stylesheet" href="//cdn.datatables.net/1.10.4/css/jquery.dataTables.min.css">
  <link rel="stylesheet" href="//cdn.datatables.net/tabletools/2.2.3/css/dataTables.tableTools.css">
  %{-- We need this custom table tools css file to override display issues with cdn version --}%
  <asset:stylesheet src="jquery.dataTables.css" />
  <asset:stylesheet src="style.css" />
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
  <meta name="google-signin-client_id" content="${grailsApplication.config.googleSignInClientId}">
  <script>
    if (location.protocol !== "https:") location.protocol = "https:";
  </script>
  <g:render template="/layouts/signin" />
  <g:layoutHead />
  <script>
    const component = {
         serverURL: "${grailsApplication.config.grails.serverURL}",
         contextPath: "${request.contextPath}",
         loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}"
       };
 </script>
</head>

<body style="margin-top: 0; padding-top: 70px;">
  <g:render template="/base/topNav" />

  <div class="container">
    <div id="login_spinner" class="hidden">
      <div class="alert alert-success alert-dismissable" style="display: block">
        Loading ... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
      </div>
    </div>
    <g:render template="/base/messages" />
    <g:layoutBody />
  </div>

  <auth:nonBroadSession>
    <div class="container">
      <div class="alert alert-danger alert-dismissable" style="display: block">
        You must be a Broad Institute User for further access. Please sign out and log in with
        a "broadinstitute.org" email account.
      </div>
      <h3>About the ORSP Portal</h3>
      <g:render template="/index/aboutBlurb" />
    </div>
  </auth:nonBroadSession>

  <div id="footer">
    <div class="container">
      <g:render template="/layouts/footer" />
    </div>
  </div>

  <asset:deferredScripts />
</body>
</html>
