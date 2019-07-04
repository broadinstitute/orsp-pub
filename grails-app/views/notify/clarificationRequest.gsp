<div>
    <p>
        ORSP has completed review of your
        <g:if test="${values != null && values.containsKey('isLink')}">  Sample/Data Cohort  </g:if>
        submission,
         <g:if test="${values != null && values.containsKey('summary')}"> ${values.get("summary")}, </g:if>
        <g:else> ${issue.summary}, </g:else>
        and requires additional clarifications
        or modifications. Please log in to the ORSP portal to respond to the comment below, and
        upload any new documents that might be required.
        If you have any questions, please contact orsp-portal@broadinstitute.org.
    </p>
    <p>Clarification :</p>
    <p style="margin-left: 50px;">${raw(comment)}</p>
    <p>
        Details regarding this submission can be accessed at
        <a href="${issueLink}">this link</a>.
    </p>
    <p>
        Thank you,
        <br>The ORSP team.
    </p>
</div>
