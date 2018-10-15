package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import com.google.common.base.Charsets
import com.google.common.io.Resources
import grails.testing.services.ServiceUnitTest
import org.broadinstitute.orsp.webservice.Ontology
import org.broadinstitute.orsp.webservice.OntologyTerm
import org.broadinstitute.orsp.webservice.ConsentOntologyService
import org.junit.Rule

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import static org.junit.Assert.assertTrue

class ConsentOntologyServiceSpec extends BaseSpec implements ServiceUnitTest<ConsentOntologyService> {
    
    private static final String DOID_9220 = "http://purl.obolibrary.org/obo/DOID_9220"

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    void stubResponse(String resourceName) {
        grailsApplication.config.consent.service.ontologyUrl = "http://localhost:${wireMockRule.port()}/"
        wireMockRule.resetAll()
        URL url = Resources.getResource(resourceName)
        String results = Resources.toString(url, Charsets.UTF_8)
        stubFor(get(anyUrl())
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(results)))
    }

    void testApneaSearch() {
        setup:
        stubResponse("apnea_results.json")

        when:
        Collection<OntologyTerm> matches = service.getDiseaseMatches("apnea")

        then:
        assertTrue(matches != null)
        assertTrue(!matches.isEmpty())
        assertTrue(matches.size() >= 2)
    }

    void testCancerSearch() {
        setup:
        stubResponse("cancer_results.json")

        when:
        Collection<OntologyTerm> matches = service.getDiseaseMatches("cancer")

        then:
        assertTrue(matches != null)
        assertTrue(!matches.isEmpty())
        assertTrue(matches.size() >= 2)
    }

    void testApneaClassSearch() {
        setup:
        stubResponse("DOID_9220.json")

        when:
        OntologyTerm match = service.getOntologyClass(Ontology.DISEASE, DOID_9220)

        then:
        assertTrue(match != null)
        assertTrue(match.label?.toLowerCase()?.contains("apnea"))
    }

}
