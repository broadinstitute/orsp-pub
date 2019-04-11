<g:javascript>
    const adminOnlyComponent = {
    isAdmin: "${session.isAdmin}",
    loadingImage: "${resource(dir: 'images', file: 'loading-indicator.svg')}"
    };
</g:javascript>

<div id="adminOnly"></div>
<asset:javascript src="build/adminOnly.js"/>
