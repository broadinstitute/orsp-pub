<div>
    ORSP has received notification that your protocol application has been approved by the IRB.
    If not already entered, please upload the associated approval letter into the Documents section of your project
    record, &quot;${issue.summary}&quot;.
    If you have any questions, please contact <a href="mailto:orsp-portal@broadinstitute.org">orsp-portal@broadinstitute.org</a>.
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
    Details regarding this submission can be accessed at:
    <a href="${issueLink}">${issueLink}</a>
</p>

