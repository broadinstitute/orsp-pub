<a class="btn btn-default ${klass} ${tag}" id="${myId}"
    <g:each in="${atts}"> data-${it.key}='${it.value}'</g:each> >
    ${label}
</a>