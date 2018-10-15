<g:if test="${flash.error}">
    <div class="alert alert-danger alert-dismissable" style="display: block">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        ${raw(flash.error)}
        ${flash.error = ""}
    </div>
</g:if>
<g:elseif test="${flash.message}">
    <div class="alert alert-success alert-dismissable" style="display: block">
        <button type="button" class="close" data-dismiss="alert" aria-hidden="true">&times;</button>
        ${raw(flash.message)}
        ${flash.message=""}
    </div>
</g:elseif>
