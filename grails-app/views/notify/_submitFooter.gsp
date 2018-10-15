<g:render template="/notify/supplementInfo" model="[user: user,
                                                    issue: issue,
                                                    comment: comment,
                                                    details: details,
                                                    issueLink: issueLink]"/>
<div style="font-size: 12pt; margin-top: 12pt">
    Details regarding this submission can be accessed at:
    <a href="${issueLink}" style="color: blue">${issueLink}</a>
</div>
