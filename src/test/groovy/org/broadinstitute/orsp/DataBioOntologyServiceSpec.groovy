package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import com.google.common.base.Charsets
import com.google.common.io.Resources
import grails.testing.services.ServiceUnitTest
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.DataBioConfiguration
import org.broadinstitute.orsp.webservice.Ontology
import org.broadinstitute.orsp.webservice.OntologyTerm
import org.broadinstitute.orsp.webservice.DataBioOntologyService
import org.junit.Rule
import spock.lang.Specification

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import static org.junit.Assert.assertTrue

@Slf4j
class DataBioOntologyServiceSpec extends Specification implements ServiceUnitTest<DataBioOntologyService> {

    Closure doWithSpring() {{ ->
        dataBioConfiguration(DataBioConfiguration) {}
    }}

    private static final String DOID_9220 = "http://purl.obolibrary.org/obo/DOID_9220"

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    void stubResponse(String resourceName) {
        service.dataBioConfiguration.searchUrl = "http://localhost:${wireMockRule.port()}/search"
        service.dataBioConfiguration.classUrl = "http://localhost:${wireMockRule.port()}/ontologies"
        wireMockRule.resetAll()
        URL url = Resources.getResource(resourceName)
        String results = Resources.toString(url, Charsets.UTF_8)
        stubFor(get(anyUrl())
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(results)))
    }

    void testCaucasianSearch() {
        when:
        stubResponse("caucasian_results.json")
        Collection<OntologyTerm> matches = service.getPopulationMatches("caucasian")

        then:
        assertTrue(matches != null)
        assertTrue(!matches.isEmpty())
        assertTrue(matches.size() >= 1)
    }

    void testApneaAncestors() {
        when:
        stubResponse("apnea_ancestors.json")
        Collection<OntologyTerm> ancestors = service.getOntologyClassAncestors(Ontology.DISEASE, DOID_9220)

        then:
        assertTrue(ancestors != null)
        assertTrue(!ancestors.isEmpty())
        assertTrue(ancestors.any {
            ancestor -> ancestor.definition?.any {
                definition -> definition.toLowerCase().contains("sleep")
            }
        })
    }

    void test4961Descendants() {
        when:
        stubResponse("4961_descendants.json")
        Collection<OntologyTerm> descendants = service.getOntologyClassDescendants(Ontology.DISEASE, "http://purl.obolibrary.org/obo/DOID_4961")

        then:
        assertTrue(descendants != null)
        assertTrue(!descendants.isEmpty())
        assertTrue(descendants.size() == 12)
    }

}
