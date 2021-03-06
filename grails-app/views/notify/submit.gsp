<p>
    Thank you for your submission, &quot;${issue.summary}&quot;, to the ORSP Portal.
    Your project has been assigned to an ORSP reviewer
    who will contact you if additional information or clarifications are needed.
    <b>Please note that you may not start work on this project until you receive approval from ORSP.</b>
    If you have any questions, please contact <a href="mailto:orsp-portal@broadinstitute.org">orsp-portal@broadinstitute.org</a>.
</p>

<g:if test="${comment && comment.size() > 0}">
    <p>Comment:</p>
    <p style="margin-left: 50px;">${raw(comment)}</p>
</g:if>

<g:if test="${issueLink}">
    <p>
        Details regarding this submission can be accessed at
        <a href="${issueLink}">this link</a>.
    </p>
</g:if>

<p>
    Thank you,
    <br>The ORSP team.
</p>

