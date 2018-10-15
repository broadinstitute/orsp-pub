<div>
    <g:if test="${issue.isFlagSet(field)}">
        <span><i class="fa fa-check-circle"></i> ${label}</span>
    </g:if>
    <g:else>
        <span style="opacity: 0.5;"><i class="fa fa-circle-thin"></i> ${label}</span>
    </g:else>
</div>
