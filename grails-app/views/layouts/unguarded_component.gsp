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
  </style>
  <script>
    if (location.protocol !== "https:") location.protocol = "https:";
  </script>
  <g:layoutHead />
  <script>
    const component = {
         serverURL: "${grailsApplication.config.grails.serverURL}",
         contextPath: "${request.contextPath}",
         loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
         clientId: "${grailsApplication.config.googleSignInClientId}"
       };
 </script>
</head>

<body style="margin-top: 0; padding-top: 70px;">
  <div class="container">
    <div id="login_spinner" class="hidden">
      <div class="alert alert-success alert-dismissable" style="display: block">
        Loading ... <span class="glyphicon glyphicon-refresh glyphicon-refresh-animate"></span>
      </div>
    </div>
    <g:render template="/base/messages" />
    <g:layoutBody />
  </div>
 <asset:deferredScripts />
</body>
</html>
