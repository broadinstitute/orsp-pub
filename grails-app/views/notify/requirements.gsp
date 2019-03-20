<p>
    Hello,
</p>
<p>
    Based on the information you provided, your recently created ${values.type} <a href="${issueLink}">${issue.summary}</a> will require the following:
</p>
    <div>
        <ul>
           <g:if test="${values.get("requireMta")?.equals("true")}">
              <li> Material Transfer Agreement </li>
           </g:if>

           <g:if test="${values.get("feeForService")?.equals("true")}">
                <li> <a href="#">Data Processing Agreement</a>  (Please have the customer sign this document and return to OSAP by responding to this email) </li>
           </g:if>

           <g:if test="${values.get("areSamplesComingFromEEAA")?.equals("true")}">
                <li> <a href="#">Research Attestation</a>  (Please have the sample provider sign this document and return to OSAP by responding to this email) </li>
           </g:if>

           <g:if test="${values.get("isConsentUnambiguous")?.equals("true")}">
                <li> <a href="#">Controller-to-Controller</a>  clauses (Please have the EEA collaborator sign this document and return to OSAP by responding to this email)  </li>
           </g:if>

        </ul>
    </div>
<p>
    If you have any questions or concerns, please contact our colleague who created this ${values.type} and is cc’d on this email.
</p>
<p>
    Thank you,
    <br> The ORSP team
</p>



