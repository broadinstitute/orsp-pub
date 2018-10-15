<g:render template="/notify/userDisplay" model="[user: user,
                                                 issue: issue,
                                                 comment: comment,
                                                 details: details,
                                                 issueLink: issueLink]"/>
<div>
    <span style="font-size: 12pt">has moved</span>
</div>
<g:render template="/notify/issueDisplay" model="[user: user,
                                                  issue: issue,
                                                  comment: comment,
                                                  details: details,
                                                  issueLink: issueLink]"/>
<div>
    <span style="font-size: 12pt">to the state</span>
    <span style="font-size: 14pt; font-style: italic">‘${issue.status.name}’</span>
</div>
<g:render template="/notify/notifyFooter" model="[user: user,
                                                  issue: issue,
                                                  comment: comment,
                                                  details: details,
                                                  issueLink: issueLink]"/>
