<html>
<head>
    <meta name="layout" content="main">
    <title>ORSP</title>
</head>

<body>

<div class="col-md-12">
    <!--<h3>About the ORSP Portal</h3>-->
    <!--<g:render template="/index/aboutBlurb"/>-->
    <!--<p></p>-->
    <div id="about"></div>
    <asset:javascript src="build/about.js"/>

    <auth:isAuthenticated>
        <div>
            <g:render template="/common/issueList"
                      model="${[assignee: true, id: "assignee", header: "My Task List"]}"/>
        </div>

        <g:render template="/common/issueList"
                  model="${[assignee: false, id: "user", header: "My Projects"]}"/>
    </auth:isAuthenticated>
</div>

</body>
</html>
