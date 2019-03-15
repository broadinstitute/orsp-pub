<%@ page import="org.broadinstitute.orsp.IssueStatus" %>
<%@ page import="org.broadinstitute.orsp.IssueType" %>
<%@ page import="org.broadinstitute.orsp.PreferredIrb" %>

<!DOCTYPE html>
<html>
<head>
    <meta name="layout" content="main">

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

        // Using a component allows us to pass GSP values to javascript objects
        const component = {
            getUserUrl: "${createLink(controller: 'authenticated', action: 'getSessionUser')}",
            searchUrl: "${createLink(controller: 'search', action: 'generalReactTablesJsonSearch')}",
            projectKeySearchUrl: "${createLink(controller: 'search', action: 'projectKeyAutocomplete')}",
            userNameSearchUrl: "${createLink(controller: 'search', action: 'getMatchingUsers')}",
            issueTypes: issueTypes,
            issueStatuses: issueStatuses,
            irbs: irbs
        };
    </script>
    <script src="https://cdnjs.cloudflare.com/ajax/libs/moment.js/2.20.1/moment-with-locales.min.js"></script>
    <link rel="stylesheet" href="https://cdnjs.cloudflare.com/ajax/libs/react-bootstrap-table/4.3.1/react-bootstrap-table-all.min.css"/>
    <link rel="stylesheet" href="https://unpkg.com/react-bootstrap-typeahead/css/Typeahead.css">
    <title>Search</title>
</head>
<body>

<div id="app"></div>
<asset:javascript src="build/search.js"/>

</body>
</html>
