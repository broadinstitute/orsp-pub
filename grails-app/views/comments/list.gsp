<%@ page contentType="text/html;charset=UTF-8" defaultCodec="none" %>
<html>
<head>
    <meta name="layout" content="minimal">
    <title>Comments</title>
</head>

<body>

<div class="container col-md-11 row">

<!--<auth:isNotViewer>-->
    <!--<div class="well">-->
        <!--<g:form controller="authenticated" action="addComment" role="form">-->
            <!--<g:hiddenField name="id" value="${issue.projectKey}"/>-->
            <!--<div class="form-group">-->
                <!--<label for="comment-field">Add Comment</label>-->
                <!--<br/>-->
                <!--<textarea name="comment" id="comment-field" rows="10" class="editor"></textarea>-->
                <!--<br/>-->
                <!--<g:submitButton name="Add" value="Add" class="btn btn-primary"/>-->
            <!--</div>-->
        <!--</g:form>-->
    <!--</div>-->
<!--</auth:isNotViewer>-->

    <div>
        <table id="comments-table" class="table table-bordered table-striped table-condensed table-hover">
            <thead>
                <tr>
                    <th>Author</th>
                    <th>Date</th>
                    <th>Comment</th>
                </tr>
            </thead>
            <tbody>
                <g:each in="${comments}" var="comment">
                    <tr>
                        <td>${comment.author}</td>
                        <td><g:formatDate format="MM/dd/yyyy HH:mm:ss" date="${comment.created}"/></td>
                        <td>${comment.formattedActionBody()}</td>
                    </tr>
                </g:each>
            </tbody>
        </table>
    </div>

</div>

</body>
</html>