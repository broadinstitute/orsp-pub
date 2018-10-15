<p>
    A new ORSP determination request regarding either institutional engagement or
    human subjects research status requires your review.
    Please use the link below to access the request.
    The application is viewable in the "Broad Project Information" tab.
    If the project qualifies for the requested determination, click on
    "Approval signed by Compliance Officer" in the "Workspace" tab.
</p>

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
