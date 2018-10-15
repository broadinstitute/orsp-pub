<%@ page import="org.broadinstitute.orsp.ConsentGroupController" %>
<html>
<head>
    <meta name="layout" content="main">
    <title>Consent Group Sample Collection Links</title>
</head>

<body>

<div class="container">

    <div style="width: 50%;">
        <fieldset>
            <legend>Create New Consent Collection Link</legend>
            <g:form controller="admin" action="createConsentCollection">
                <div class="form-group">
                    <label for="projectKey">Project</label>
                    <input type="text" class="form-control" id="projectKey" name="projectKey">
                </div>

                <div class="form-group">
                    <label for="consentKey">Consent Group</label>
                    <input type="text" class="form-control" id="consentKey" name="consentKey">
                </div>

                <div class="form-group">
                    <label for="sampleCollectionId">Sample Collection</label>
                    <input type="text" class="form-control" id="sampleCollectionId" name="sampleCollectionId">
                </div>
                <input type="submit" value="Add" class="btn btn-primary"/>
            </g:form>
        </fieldset>
    </div>

    <br/>

    <div>
        <h3>Consent Collection Links</h3>

        <table id="collectionLinks" class="table table-bordered table-striped">
            <thead>
            <tr>
                <th>Project</th>
                <th>Consent Group</th>
                <th>Sample Collection</th>
            </tr>
            </thead>
            <tbody>
            <g:each in="${consentCollections}" var="consent">
                <tr>
                    <td><a href="${createLink(controller: "authenticated", action: "show", params: [id: consent.projectKey])}">${consent.projectKey}</a></td>
                    <td><a href="${createLink(controller: "consentGroup", action: "show", params: [id: consent.consentKey])}">${consent.consentKey}</a></td>
                    <td>
                        <g:if test="${consent.sampleCollection}">
                            ${consent.sampleCollectionId}: ${consent.sampleCollection?.name} (${consent.sampleCollection?.groupName})
                        </g:if>
                        <g:else>None</g:else>
                    </td>
                </tr>
            </g:each>
            </tbody>
        </table>
    </div>

</div>

</body>
</html>

<asset:script type="text/javascript">

    $(document).ready(function(){
        $("#projectKey").autocomplete({
            source: "${createLink(controller: 'admin', action: 'getMatchingProjects')}",
            minLength: 2
        });

        $("#consentKey").autocomplete({
            source: "${createLink(controller: 'admin', action: 'getMatchingConsents')}",
            minLength: 2
        });

        $("#collectionLinks").dataTable({
            "sDom": '<"H"Tfr>t<"F"lpi>',
            "oTableTools": {
                "sSwfPath": "${request.contextPath}/assets/media/swf/copy_csv_xls.swf",
                "aButtons": [ "copy", "csv", "xls"]
            },
            "bJQueryUI": true,
            "bInfo": false,
            "oLanguage": { sSearch: 'Filter:' },
            "sPaginationType": "full_numbers",
            "iDisplayLength": 50,
            "aoColumnDefs": [
                {"aTargets": [ 0, 1 ], "sType": "ticket"}
            ]
        });

    });

    $(document).ready(function(){
        $("#sampleCollectionId").autocomplete({
            source: "${createLink(controller: 'admin', action: 'getMatchingUnConsentedSampleCollections')}",
            minLength: 0
        });
    });

</asset:script>
