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
    A member from the OSAP team, cc’d here will be in touch with you shortly to proceed with obtaining them.
</p>
<g:if test="${values.get("type").equals("Project") || values.get("feeForService")?.equals("true") || values.get("areSamplesComingFromEEAA")?.equals("true") || values.get("isConsentUnambiguous")?.equals("true")}">
<p>
    NOTE: GDPR applies to this ${values.type}.
</p>
</g:if>
<p>
    Thank you,
    <br> The BRICC team
</p>



