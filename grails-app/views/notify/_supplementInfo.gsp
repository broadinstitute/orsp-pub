<g:if test="${details}">
    <div style="border: solid 1pt; padding: 5pt; margin-top: 12pt; font-size: 12pt">
        <span style="font-style: italic">Details:</span>
        <g:each in="${details}">
            <div style="margin-left: .25in">${it}</div>
        </g:each>
    </div>
</g:if>

<g:if test="${comment}">
    <div style="font-size: 12pt; margin-top: 12pt">
        <span style="font-style: italic">Comment:</span>
        <div style="margin-left: .25in">
            ${raw(comment)}
        </div>
    </div>
</g:if>
