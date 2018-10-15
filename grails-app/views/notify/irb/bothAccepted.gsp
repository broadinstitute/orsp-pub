<div>
    Your draft IRB application for ${issue.projectKey}, &quot;${issue.summary}&quot;,
    as well as any associated supporting documents (e.g. consent forms),
    have been reviewed by ORSP and are considered ready for IRB submission.
    Please submit to the IRB in accordance with the guidelines of the relevant institution.
    In some cases, ORSP may be able to submit the application on your behalf.
    Contact orsp-portal@broadinstitute.org for additional guidance.
</div>

<g:if test="${details}">
    <div>
        <p>Details:</p>
        <g:each in="${details}">
            <p style="margin-left: 50px;">${it}</p>
        </g:each>
    </div>
</g:if>

<g:if test="${comment && comment.size() > 0}">
    <p>Comment:</p>
    <p style="margin-left: 50px;">${raw(comment)}</p>
</g:if>

<p>
    Details regarding this submission can be accessed at:
    <a href="${issueLink}">${issueLink}</a>
</p>
