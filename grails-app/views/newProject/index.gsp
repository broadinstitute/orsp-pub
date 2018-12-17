<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>

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
        const user = {
            <g:if test="${session?.user}">
                name: "${session.user.displayName}",
                email: "${session.user.emailAddress}"
            </g:if>
        };

        const component = {
            user: user,
            searchUsersURL: "${createLink(controller: 'search', action: 'getMatchingUsers')}"
        };
    </script>
</head>
<body>

<div id="pages"></div>
<asset:javascript src="pages.js"/>

</body>
</html>
