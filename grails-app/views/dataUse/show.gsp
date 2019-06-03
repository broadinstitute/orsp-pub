<html>
<head>
    <meta name="layout" content="main">
    <title>Data Use Restrictions for Consent Group: ${consent.projectKey}</title>
</head>

<body>

<h1>Data Use Restrictions for Consent Group: ${consent.projectKey}</h1>

<g:render template="/base/messages"/>

<div class="panel panel-default">

    <div class="panel-heading">
        <h3 class="panel-title">Data Use Restriction Summary</h3>
    </div>

    <div class="panel-body">
        <p>${raw(summary.join("<br/>"))}</p>
    </div>

</div>

<div class="panel panel-default">

    <div class="panel-heading">
        <h3 class="panel-title">Data Use Restriction Details</h3>
    </div>

    <div class="panel-body">

        <div class="container-fluid">

            <table class="table table-bordered table-striped">
                <tbody>
                <tr>
                    <th>Consent Group</th>
                    <td>
                        <a href="${createLink(controller: 'consentGroup', action: 'show', params: [id: consent.projectKey, tab: "documents"])}">${consent.projectKey}: ${consent.summary}</a>
                    </td>
                </tr>
                <tr>
                    <th>Principal Investigator listed on the informed consent form</th>
                    <td>${restriction.consentPIName}</td>
                </tr>
                <tr>
                    <th>Data is available for future research with no restrictions</th>
                    <td>${restriction.noRestriction? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>Data is available for future general research use</th>
                    <td>${restriction.generalUse ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>Data is available for health/medical/biomedical research</th>
                    <td>${restriction.hmbResearch ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>Future use is limited to research involving the following disease area(s)</th>
                    <td>
                        <g:if test="${restriction.diseaseRestrictions.size() > 1}">
                            <ul>
                                <g:each in="${restriction.diseaseRestrictions}" var="it">
                                    <li>${it}</li>
                                </g:each>
                            </ul>
                        </g:if>
                        <g:elseif test="${restriction.diseaseRestrictions.size() == 1}">
                            ${restriction.diseaseRestrictions.get(0)}
                        </g:elseif>
                    </td>
                </tr>
                <tr>
                    <th> Future use of population origins or ancestry is prohibited </th>
                    <td>${restriction.populationOriginsAncestry ? "Yes" : "No"}</td>
                </tr>
                <tr>
                <tr>
                    <th>Future commercial use is prohibited</th>
                    <td>${restriction.commercialUseExcluded ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>Future use for methods research (analytic/software/technology development) is prohibited</th>
                    <td>${restriction.methodsResearchExcluded ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>Future use of aggregate-level data for general research purposes is prohibited</th>
                    <td>${restriction.aggregateResearchResponse }</td>
                </tr>
                <tr>
                    <th>Future as a control set for diseases other than those specified is prohibited</th>
                    <td>${restriction.controlSetOption }</td>
                </tr>
                <tr>
                    <th>Future use is limited to research involving a particular gender</th>
                    <td>${restriction.gender}</td>
                </tr>
                <tr>
                    <th>Future use is limited to pediatric research</th>
                    <td>${restriction.pediatricLimited ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>Future use is limited to research involving a specific population</th>
                     <td>
                        <g:if test="${restriction.populationRestrictions.size() > 1}">
                            <ul>
                                <g:each in="${restriction.populationRestrictions}" var="it">
                                    <li>${it}</li>
                                </g:each>
                            </ul>
                        </g:if>
                        <g:elseif test="${restriction.populationRestrictions.size() == 1}">${restriction.populationRestrictions?.get(0)}</g:elseif>
                    </td>
                </tr>
                <tr>
                    <th>Future use is limited to data generated from samples collected after the following consent form date</th>
                    <td><g:formatDate date="${restriction.dateRestriction}" format="MM/dd/yyyy"/></td>
                </tr>
                <g:if test="${restriction.recontactingDataSubjects}">
                    <tr>
                        <th>Subject re-contact <strong> may </strong> occur in certain circumstances, as specified </th>
                        <td>${restriction.recontactMay} </td>
                    </tr>
                    <tr>
                        <th>Subject re-contact <strong> must </strong> occur in certain circumstances, as specified </th>
                        <td>${restriction.recontactMust} </td>
                    </tr>
                </g:if>
                <tr>
                    <th> Participants' genomic and phenotypic data is available for future research and broad sharing</th>
                    <td>${restriction.genomicPhenotypicData} </td>
                </tr>
                <tr>
                    <th>Collaboration with the primary study investigators required </th>
                    <td>${restriction.collaborationInvestigators? "Yes" : "No"} </td>
                </tr>
                <tr>
                    <th>Data storage on the cloud is prohibited </th>
                    <td>${restriction.cloudStorage} </td>
                </tr>
                <tr>
                    <th>Ethics committee approval is required </th>
                    <td>${restriction.irb ? "Yes" : "No"} </td>
                </tr>
                <tr>
                    <th>Publication of results of studies using the data is required </th>
                    <td>${restriction.publicationResults? "Yes" : "No"} </td>
                </tr>
                <tr>
                    <th>Genomic summary results from this study are available only through controlled-access</th>
                    <td>${restriction.genomicResults? "Yes" : "No"} </td>
                </tr>
                <tr>
                    <th>Genomic summary </th>
                    <td>${restriction.genomicResults? raw(restriction.genomicSummaryResults) : "--"} </td>
                </tr>
                <tr>
                    <th> Geographical restrictions</th>
                    <td>${restriction.geographicalRestrictions} </td>
                </tr>
                <tr>
                    <th>Other Restrictions</th>
                    <td>${raw(restriction.other)}</td>
                </tr>
                <tr>
                    <th>Future use of this data requires manual review</th>
                    <td>${restriction.manualReview ? "Yes" : "No"}</td>
                </tr>
                <tr>
                    <th>ORSP Comments</th>
                    <td>${restriction.comments}</td>
                </tr>
                <tr>
                    <th>DUOS Export</th>
                    <td>
                        <ul>
                            <g:if test="${restriction.vaultConsentId}">
                                <li>Export Date: <g:formatDate date="${restriction.vaultExportDate}" format="MM/dd/yyyy"/></li>
                                <li>Consent ID: ${restriction.vaultConsentId}</li>
                                <li>
                                    <a href="${restrictionUrl}">Consent</a>
                                </li>
                                <li>
                                    <a href="${restrictionUrl}/association">Consent Samples</a>
                                </li>
                            </g:if>
                            <g:else>
                                <li>Not exported to DUOS</li>
                            </g:else>
                        </ul>
                    </td>
                </tr>
                </tbody>
            </table>

        </div>
    </div>

    <div class="panel-footer">
      <auth:isNotViewer>
        <a href="${createLink(controller: "dataUse", action: "edit", params: [id: restriction.id])}" class="btn btn-default">Edit</a>
      </auth:isNotViewer>
    </div>

</div>


<div class="panel panel-default">

    <div class="panel-heading">
        <h3 class="panel-title">Export Data Use Restrictions to DUOS</h3>
    </div>

    <div class="panel-body">
        <p>
            Exporting consent data information to the vault will enable other systems to recognize the data use
            restrictions required for the samples that are associated to the consent group.
        </p>
        <pre>${consentResource}</pre>

        <p>The following samples will be associated to this set of data use restrictions:</p>
        <ul>
            <g:each in="${collectionLinks?.sampleCollection?.unique()}" var="sample">
                <li>${sample?.id}: ${sample?.name}</li>
            </g:each>
        </ul>

        <auth:isNotViewer>
        <div class="well">
            <g:set var="exported" value="${restriction.vaultConsentId != null}"/>
            <g:set var="exportOrUpdate" value="${exported ? 'Update' : 'Export'}"/>

              <p>
                Export (or update) this consent to DUOS.
              </p>
              <a href="${createLink(controller: "dataUse", action: "exportConsent", params: [id: restriction.id])}" class="btn btn-default link-btn">${exportOrUpdate} Consent</a>
        </div>
        </auth:isNotViewer>
    </div>

</div>
</body>
</html>
