<div style="font-size: 12pt; margin-top: 12pt">
    The IRB has completed review of your submission,  ${issue.projectKey},
    <span style="font-size: 12pt; font-style: italic">‘${issue.summary}’,</span>
    and requires additional clarifications or modifications, as noted in the Comments field below.
    Please log in to the ORSP portal to upload any newly required or revised documents.
    If you have any questions, please contact orsp@broadinstiute.org
</div>
<g:render template="/notify/submitFooter" model="[user: user,
                                                  issue: issue,
                                                  comment: comment,
                                                  details: details,
                                                  issueLink: issueLink]"/>
