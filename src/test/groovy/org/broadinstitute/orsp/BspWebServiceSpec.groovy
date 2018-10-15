package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import grails.testing.services.ServiceUnitTest
import org.junit.Rule

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

class BspWebServiceSpec extends BaseSpec implements ServiceUnitTest<BspWebService> {

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    void "Get all sample collections"() {
        given:
        String path = "/ws/bsp/collection/get_all_collections"
        grailsApplication.config.bsp.service.allSampleCollectionsUrl = "http://localhost:${wireMockRule.port()}${path}"
        wireMockRule.resetAll()
        stubFor(get(urlEqualTo(path))
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "text/plain")
                .withBody(
                "Collection ID\tCollection Name\tCollection Category\tGroup Name\tArchived\n" +
                        "SC-1101\tJackson Heart Study - Cardiovascular\tReich - Cardio\tPopulation\t0\n" +
                        "SC-11855\tDavid Reich (Whitehead) - JHS Samples\tReich\tPopulation\t0\n" +
                        "SC-1100\tJackson Heart Study - Diabetes\tReich - Diabetes\tPopulation\t0\n" +
                        "SC-1098\tEuropean American - Prostate Samples\tReich - Prostate\tPopulation\t0\n" +
                        "SC-10287\tTabin - Mouse Tail DNA\tSabeti\tPopulation\t0\n" +
                        "SC-1233\tOLD_Reich_Lab\t\tPopulation\t1\n" +
                        "SC-1103\tColombian Population Samples\tReich\tPopulation\t0")))

        when:
        def sampleCollections = service.getBspCollections()
        then:
        sampleCollections != null
        !sampleCollections.isEmpty()
        sampleCollections.size() == 7
    }

}
