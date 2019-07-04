<div>
    <p>
        User ${user.displayName}, has entered a comment for ${issue.typeLabel} ${issue.projectKey}
    </p>
    <p>Comment:</p>
    <p style="margin-left: 50px;">${raw(comment)}</p>
    <p>
        Details regarding this submission can be accessed at:
        <a href="${issueLink}">${issueLink}</a>
    </p>
</div>
