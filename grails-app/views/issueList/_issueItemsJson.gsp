<%@ page import="groovy.json.StringEscapeUtils" %>
{
"aaData":
    [<g:each in="${issueList}" var="instance" status="i">
        [
            "<a href='${instance.url}'>${instance.key}</a>",
            "<a href='${instance.url}'>${StringEscapeUtils.escapeJava(instance.summary)}</a>",
            "${instance.status}",
            "${instance.type}",
            "<g:formatDate date="${instance.updateDate}" format="MM/dd/yyyy"/>",
            "<g:formatDate date="${instance.expirationDate}" format="MM/dd/yyyy"/>"
        ]${i < issueList.size() - 1 ? "," : ""}</g:each>
    ]
}
