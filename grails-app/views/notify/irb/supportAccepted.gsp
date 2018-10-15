<div>
    Documents associated with ${issue.projectKey}, &quot;${issue.summary}&quot;,
    have been reviewed by ORSP, and are considered adequate to support an IRB application.
    Please assemble a draft application, and upload it into the &quot;Documents&quot;
    section of the ORSP portal.
    When the draft is ready for ORSP review, click on &quot;Submit Application to ORSP&quot;
    in your &quot;Workspace&quot; tab.
    Please note that if your protocol will be submitted to an institution
    with an electronic IRB system (e.g. Partners Health Care),
    ORSP can review the draft in that system;
    there is no need to enter it into the Portal separately.
    Please contact <a href="mailto:orsp-portal@broadinstitute.org">orsp-portal@broadinstitute.org</a> for additional guidance.
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
