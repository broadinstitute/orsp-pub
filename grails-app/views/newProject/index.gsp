<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">
    <meta charset="utf-8"/>

    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css">
    <title>Project</title>
    <script type="application/javascript">

        const component = {
            getUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
            searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
            attachDocumentsURL: "${createLink(uri: '/api/files-helper/attach-document', method: 'POST')}",
            createProjectURL: "${createLink(controller:'project', action: 'save', uri: '/api/project', method: 'POST')}",
            serverURL: "${webRequest.baseUrl}",
            loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}",
            deleteProject: '${createLink(uri: '/api/project/delete', method: 'DELETE')}'
        };
    </script>
</head>
<body>

<div id="project"></div>
<asset:javascript src="project.js"/>

</body>
</html>
