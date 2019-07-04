<div>
    ORSP had completed its review of your project, &quot;${issue.summary}&quot;,
    and determined that it does not constitute human subjects research.
    No IRB submission is required.
    Any changes that may alter this determination must be submitted to the
    Office of Research Subject Protection for review via a Clarification Request.
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
    Please reference the ORSP ID number, ${issue.projectKey}, indicated in this email's subject line when entering regulatory
    information into Mercury's product ordering system: <a href="http://mercury/Mercury">http://mercury/Mercury</a>
</p>
<p>
    Details regarding this submission can be accessed at
    <a href="${issueLink}">this link</a>.
</p>
