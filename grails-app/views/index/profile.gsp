<html>
<head>
    <meta name="layout" content="main">
    <title>User Profile</title>
</head>

<body>
<div class="col-md-10">
    <h3>User Profile</h3>
    <g:if test="${user}">
        <ul>
            <li><strong>Name:</strong> ${user.displayName}</li>
            <li><strong>Email:</strong> ${user.emailAddress}</li>
            <li><strong>Username:</strong> ${user.userName}</li>
            <li><strong>Last Login:</strong> <g:formatDate date="${user.lastLoginDate}" format="yyyy-MM-dd HH:mm"/></li>
        </ul>
    </g:if>
    <g:else>
        <div class="alert alert-danger alert-dismissable" style="display: block">
            Unable to find details for current user.
        </div>
    </g:else>
</div>
</body>
</html>