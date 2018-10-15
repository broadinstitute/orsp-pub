<table id="data-use-table" class="table table-hover table-bordered">
    <thead>
    <tr>
        <th title="Data Use Record">Data Use Record</th>
        <th title="Consent Group">Consent Group</th>
        <th title="Collection">Collection</th>
        <th title="Restrictions">Restrictions</th>
        <th title="Requires Manual Review">Requires Manual Review</th>
        <th title="Linked Projects">Linked Projects</th>
        <th title="Status">Status</th>
    </tr>
    </thead>
    <tbody>
    <g:each in="${issues}" status="i" var="issue">
        <tr>
            <td>
                <g:link action="show" id="${issue.projectKey}" controller="${issue.controller}">
                    ${issue.projectKey}
                </g:link>
            </td>
            <td>${issue.consentGroupTitle}</td>
            <td>${issue.collectionInformation}</td>
            <td>
                <g:if test="${issue.requiresManualReview && ! session.isOrsp}">
                    Please Consult ORSP
                </g:if>
                <g:else>
                    ${issue.restrictions}
                </g:else>
            </td>
            <td><g:if test="${issue.requiresManualReview}">Yes</g:if><g:else>No</g:else></td>
            <td>
                <g:each in="${issue.parentIssues}" var="parent">
                    <g:link action="show" id="${parent.projectKey}" controller="${parent.controller}">
                        ${parent.projectKey}
                    </g:link>
                </g:each>
            </td>
            <td>${issue.issuestatus.pname}</td>
        </tr>
    </g:each>
    </tbody>
</table>