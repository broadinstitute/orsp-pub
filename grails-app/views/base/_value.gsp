%{--
This template requires the following arguments:
[value]
And tries to coerce the value (list or otherwise) into a legible format
--}%
<g:if test="${!value}">N/A</g:if>
<g:elseif test="${(value instanceof List)}">
    <g:set var="values" value="${(List) value}"/>
    <g:if test="${values.size() == 1}">
        ${values.first()}
    </g:if>
    <g:else>
        <g:each in="${values}" status="i" var="val">
            ${val}<g:if test="${i < values.size() - 1}">,</g:if>
        </g:each>
    </g:else>
</g:elseif>
<g:elseif test="${(value instanceof Date)}">
    <g:formatDate date="${value}" type="date" style="MEDIUM"/>
</g:elseif>
<g:else>
    ${raw(value)}
</g:else>
