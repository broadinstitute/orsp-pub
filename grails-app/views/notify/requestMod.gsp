<div>
    ORSP has completed review of your submission, ‘${issue.summary}’,
    and requires additional clarifications or modifications.
    Please log into the ORSP portal to respond the comment below,
    and upload any new documents that might be required.
    If you have any questions, please contact orsp-portal@broadinstitute.org.
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
    Details regarding this submission can be accessed at
    <a href="${issueLink}">this link</a>.
</p>
