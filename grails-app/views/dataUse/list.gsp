<html>
<head>
    <meta name="layout" content="main">
    <title>Data Use Restrictions</title>
    <style type="text/css">
        tr.group, tr.group:hover {
            background-color: #ddd !important;
        }
    </style>
</head>

<body>

<h3>Data Use Restrictions</h3>

<table id="restrictionsTable" class="table table-striped table-bordered">
    <thead>
    <tr>
        <th>Consent Group</th>
        <th>Restrictions</th>
        <th>DUOS Export</th>
    </tr>
    </thead>
    <tbody>
    <g:each in="${restrictions}" var="restriction">
        <tr>
            <td>
                <a href="${createLink(controller: 'consentGroup', action: 'show', params: [id: restriction.consentGroupKey, tab: "documents"])}">
                    ${restriction.consentGroupKey}
                </a>
            </td>
            <td>
                <a href="${createLink(controller: 'dataUse', action: 'show', params: [id: restriction.id])}">View Restrictions</a>
            </td>
            <td>
                <g:if test="${restriction.vaultExportDate}">
                    <g:formatDate date="${restriction.vaultExportDate}" format="MM/dd/yyyy"/>
                </g:if>
            </td>
        </tr>
    </g:each>
    </tbody>
</table>


<h3>Consent Groups and Sample Collections</h3>

<p>
    The following consent groups have sample collection associations.
</p>

<table id="consentsTable" class="table table-striped table-bordered">
    <thead>
    <tr>
        <th>Consent Group</th>
        <th>Sample Collection(s)</th>
        <th>DUOS Export</th>
    </tr>
    </thead>
    <tbody>
    <g:each in="${consentMap}" var="map">
        <g:set var="consentCollectionLink" value="${consentCollections.find {it.consentKey.equals(map.key)}}"/>
        <tr>
            <td>
                <a href="${createLink(controller: 'consentGroup', action: 'show', params: [id: map.key, tab: "documents"])}">
                    ${map.key}
                </a>
            </td>
            <td>
                <ul>
                    <g:each in="${map.value}" var="consent">
                        <g:if test="${consent.expired}">
                            <li style="color: red;">${consent.sampleCollectionId}: ${consent.sampleCollection?.name} (associated on <g:formatDate date="${consent.creationDate}" format="MM/dd/yyyy"/>)</li>
                        </g:if>
                        <g:else>
                            <li>${consent.sampleCollectionId}: ${consent.sampleCollection?.name} (associated on <g:formatDate date="${consent.creationDate}" format="MM/dd/yyyy"/>)</li>
                        </g:else>
                    </g:each>
                </ul>
            </td>
            <td>
                <g:formatDate date="${consentCollectionLink?.restriction?.vaultExportDate}" format="MM/dd/yyyy"/>
            </td>
        </tr>
    </g:each>
    </tbody>
</table>

</body>
</html>

<asset:script type="text/javascript">

    $(document).ready(function() {
        $.fn.dataTable.moment( 'M/D/YYYY' );
        $("#restrictionsTable, #consentsTable").DataTable({
            dom: '<"H"Tfr><"pull-right"B><div>t</div><"F"lp>',
            buttons: [],
            language: { search: 'Filter:' },
            pagingType: "full_numbers",
            pageLength: 50,
            order: [[ 0, "asc" ]],
            columnDefs: [{targets: [0], type: "ticket"}]
        });
    });

</asset:script>