<p>
    Hello,
</p>
<p>
    Below is a summary of information provided for the recently created Consent Group <a href="${issueLink}">${issue.summary}</a>
</p>


    <div>
        <ol>
            <li> As part of this project, will be Broad receive either personally identifiable information (PII) or protected health information (PHI)?
               <p> <b> ${values.get("pii")} </p>
            </li>
            <li> Are you bound by any regulatory compliance (FISMA, CLIA, etc.)? If yes, which one?
                <p> <b> ${values.get("compliance")} </p>

                <g:if test=" ${values.get("textCompliance") == "true"}">
                    <p>Regulatory compliance:  ${values.get("textCompliance")}</p>
                </g:if>

            </li>
            <li> Does this data require additional protections beyond Broad’s standard data security measures? If yes, please explain.
               <p> <b> ${values.get("sensitive")} </p>

               <g:if test="${values.get("textSensitive") == "true"}">
                  <p>Explanation: ${values.get("textSensitive")} </p>
               </g:if>

            </li>
            <li> Will the data collected or generated as part of this project be made available in an unrestricted/open-access environment (e.g. publicly available on the internet, shared via an open access repository such as GEO, etc.)? If yes, please explain.
               <p> <b> ${values.get("accessible")}</p>

               <g:if test=" ${values.get("textAccessible") == "true"}  ">
                  <p>Explanation:  ${values.get("textAccessible")} </p>
               </g:if>

            </li>
        </ol>
    </div>
<p>
    If you have any questions or concerns, please contact our colleague who created this Consent Group and is cc’d on this email.
</p>
<p>
    Thank you,
    <br> The ORSP team
</p>

