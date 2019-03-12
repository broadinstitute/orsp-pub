<div>
    <p>
        User ${user.displayName}, has requested a clarification  for ${issue.typeLabel} ${issue.projectKey}
    </p>
    <p>Clarification :</p>
    <p style="margin-left: 50px;">${raw(comment)}</p>
    <p>
        Details regarding this submission can be accessed at:
        <a href="${issueLink}">${issueLink}</a>
    </p>
</div>