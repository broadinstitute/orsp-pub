package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import grails.testing.services.ServiceUnitTest
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.ConsentConfiguration
import org.broadinstitute.orsp.consent.ConsentResource
import org.broadinstitute.orsp.consent.DataUseDTO
import org.broadinstitute.orsp.webservice.OntologyTerm
import org.junit.Rule

import java.text.SimpleDateFormat

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.post
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig
import static org.junit.Assert.assertNotNull

@SuppressWarnings("GroovyAssignabilityCheck")
@Slf4j
class ConsentServiceUnitSpec extends BaseSpec implements ServiceUnitTest<ConsentService> {

    Closure doWithSpring() {{ ->
        consentConfiguration(ConsentConfiguration)
    }}

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    void "Post a Consent"() {
        given:
        JsonElement everything = new JsonParser().parse("{\"type\":\"everything\"}").asJsonObject
        service.consentConfiguration.url = "http://localhost:${wireMockRule.port()}/consent"
        wireMockRule.resetAll()
        // Create Consent endpoint
        stubFor(post(urlEqualTo("/consent"))
                .willReturn(aResponse()
                .withStatus(201)
                .withHeader("Content-Type", "application/json")
                .withHeader("Location", "http://localhost:${wireMockRule.port()}/consent/consent-id")
                .withBody()))
        ConsentResource consent = new ConsentResource(
                requiresManualReview: false,
                useRestriction: everything.asJsonObject,
                name: UUID.randomUUID().toString())

        when:
        def location = service.postConsent(consent)

        then:
        assertNotNull(location)
    }

    void "ConsentService.stripTextOfHtml works in covered cases"() {
        given:
        def nullString = null
        def emptyString = ""
        def regularText = "The Fox and the Hound"
        def htmlText = "<p>The Fox and the Hound</p>"
        def moreHtmlText = "<p>The <b>Fox</b> and the <span>Hound</span></p>"

        expect:
        ConsentService.stripTextOfHtml(nullString) == ""
        ConsentService.stripTextOfHtml(emptyString) == ""
        ConsentService.stripTextOfHtml(regularText) == regularText
        ConsentService.stripTextOfHtml(htmlText) == regularText
        ConsentService.stripTextOfHtml(moreHtmlText) == regularText
    }

    void "Parse General Use DataUseDTO object"() {
        given:
        // This DUR should still evaluate to GU even with restrictions that don't make sense
        DataUseRestriction dur = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true,
                gender: "Male",
                pediatricLimited: true)

        when:
        DataUseDTO dto = service.parseDataUseDto(dur)

        then:
        dto.generalUse
    }

    void "Parse HMB DataUseDTO object"() {
        given:
        // This DUR should evaluate to HMB
        DataUseRestriction dur = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: false,
                hmbResearch: true
        )

        when:
        DataUseDTO dto = service.parseDataUseDto(dur)

        then:
        !dto.generalUse
        dto.hmbResearch
    }

    void "Parse Restricted DataUseDTO object"() {
        given:
        // This DUR should hit all of the potential values that ORSP sends to DUOS
        def other = "Only on Tuesdays"
        DataUseRestriction dur = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: false,
                hmbResearch: true,
                diseaseRestrictions: ["cancer"],
                populationOriginsAncestry: true,
                commercialUseExcluded: true,
                methodsResearchExcluded: true,
                aggregateResearchResponse: "Yes",
                controlSetOption: "Yes",
                gender: "male",
                pediatricLimited: true,
                populationRestrictions: ["generation X"],
                dateRestriction: new Date(),
                genomicPhenotypicData: "Yes",
                irb: true,
                geographicalRestrictions: "USA",
                otherRestrictions: true,
                other: "<p>${other}</p>"
        )

        when:
        DataUseDTO dto = service.parseDataUseDto(dur)

        then:
        !dto.generalUse
        dto.hmbResearch
        dto.diseaseRestrictions
        dto.populationOriginsAncestry
        !dto.commercialUse
        dto.methodsResearch
        dto.aggregateResearch == "Yes"
        dto.controlSetOption == "Yes"
        dto.gender == "Male"
        dto.pediatric
        dto.populationRestrictions
        dto.dateRestriction
        dto.genomicPhenotypicData == "Yes"
        dto.ethicsApprovalRequired
        dto.geographicalRestrictions == "USA"
        dto.otherRestrictions
        dto.other == other
    }

    void "Build General Use Consent Resource"() {
        given:
        String everythingString = "{\"type\":\"everything\"}"
        JsonParser parser = new JsonParser()
        JsonElement everything = parser.parse(everythingString).asJsonObject
        OntologyService ontologyService = Mock(OntologyService)
        service.setOntologyService(ontologyService)
        DataUseRestriction restriction = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true)

        when:
        ConsentResource consent = service.buildConsentResource(restriction)

        then: "Consent restriction should really be an Everything object."
        // Mock the Ontology Service so any call to `getUseRestriction` returns an Everything
        // simulating a successful response from Ontology.
        // Should only be called once
        1 * ontologyService.getUseRestriction(*_) >> everything
        !consent.requiresManualReview
        consent.useRestriction == everything
    }

    void "Fail to build General Use Consent Resource"() {
        given:
        OntologyService ontologyService = Mock(OntologyService)
        service.setOntologyService(ontologyService)
        DataUseRestriction restriction = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true)

        when:
        ConsentResource consent = service.buildConsentResource(restriction)

        then: "Consent restriction should be null."
        // Mock the Ontology Service so any call to `getUseRestriction` returns null simulating an
        // exception response from Ontology
        // Should only be called once
        1 * ontologyService.getUseRestriction(*_) >> null
        !consent.requiresManualReview
        null == consent.useRestriction
    }

    void "Successfully retrieve Consent from DUOS"() {
        given:
        def url = "http://localhost:${wireMockRule.port()}/anything"
        def uuid = UUID.randomUUID().toString()
        def resourceString = "{" +
                "  \"consentId\": \"${uuid}\"," +
                "  \"requiresManualReview\": false," +
                "  \"dataUseLetter\": \"https://storage.googleapis.com/bucket/12345.txt\"," +
                "  \"useRestriction\": {" +
                "    \"type\": \"everything\"" +
                "  }," +
                "  \"name\": \"TEST-12345\"," +
                "  \"groupName\": \"Test / 5555555\"," +
                "  \"dulName\": \"test.txt\"," +
                "  \"createDate\": 1517230736000," +
                "  \"lastUpdate\": 1521636493000," +
                "  \"sortDate\": 1521636493000," +
                "  \"translatedUseRestriction\": \"Samples are restricted for use under the following conditions:Data is available for general research use. [GRU]\"," +
                "  \"dataUse\": {" +
                "    \"generalUse\": true" +
                "  }" +
                "}"
        wireMockRule.resetAll()
        stubFor(get(anyUrl())
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(resourceString)))

        when:
        ConsentResource resource = service.getConsent(url)

        then:
        resource != null
        resource.consentId == uuid
    }

    void "Fail to retrieve Consent from DUOS"() {
        given:
        def url = "http://localhost:${wireMockRule.port()}/anything"
        wireMockRule.resetAll()
        stubFor(get(anyUrl())
                .willReturn(aResponse()
                .withStatus(400)
                .withHeader("Content-Type", "application/json")))

        when:
        service.getConsent(url)

        then:
        def e = thrown(ConsentException)
        e.message == "Unable to parse DUOS response: Error getting consent for url: ${url}: Bad Request"
    }

    void "Fail to parse successfully retrieved Consent from DUOS"() {
        given:
        def url = "http://localhost:${wireMockRule.port()}/anything"
        def invalidResourceString = "{" +
                "  \"requiresManualReview\": false," +
                "  \"dataUseLetter\": \"https://storage.googleapis.com/bucket/12345.txt\"," +
                "  \"useRestriction\": {" +
                "    \"type\": \"everything\"" +
                "  }," +
                "  \"name\": \"TEST-12345\"," +
                "  \"groupName\": \"Test / 5555555\"," +
                "  \"dulName\": \"test.txt\"," +
                "  \"createDate\": 1517230736000," +
                "  \"lastUpdate\": 1521636493000," +
                "  \"sortDate\": 1521636493000," +
                "  \"translatedUseRestriction\": \"Samples are restricted for use under the following conditions:Data is available for general research use. [GRU]\"," +
                "  \"dataUse\": {" +
                "    \"generalUse\": true" +
                "  }" +
                "}"
        wireMockRule.resetAll()
        stubFor(get(anyUrl())
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(invalidResourceString)))

        when:
        service.getConsent(url)

        then:
        def e = thrown(ConsentException)
        e.message.contains("Invalid consent resource")
    }

    void "Get Summary"() {
        given:
        Date now = new Date()
        SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy")
        String formattedNow = formatter.format(now)
        OntologyService ontologyService = Mock(OntologyService)
        OntologyTerm term = new OntologyTerm(
                id: "id",
                label: "label",
                synonyms: ["synonym"],
                definition: ["definition"],
                obsolete: false,
                type: "type"
        )
        ontologyService.getOntologyClass(*_) >> term
        service.setOntologyService(ontologyService)

        DataUseRestriction gru = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true
        )
        def diseases = ["label"]
        def populations = ["id"]
        def recontactMay = "yes"
        def recontactMust = "yes"
        def geographicalRestrictions = "geo"
        def other = "<p>Other</p>"
        DataUseRestriction multi = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true,
                hmbResearch: true,
                diseaseRestrictions: diseases,
                populationOriginsAncestry: true,
                commercialUseExcluded: true,
                methodsResearchExcluded: true,
                controlSetOption: "Yes",
                gender: "Male",
                populationRestrictions: populations,
                pediatricLimited: true,
                dateRestriction: now,
                aggregateResearchResponse: "Yes",
                recontactingDataSubjects: true,
                recontactMay: recontactMay,
                recontactMust: recontactMust,
                cloudStorage: "Yes",
                irb: true,
                geographicalRestrictions: geographicalRestrictions,
                other: other
        )

        when:
        String gruSummary = service.getSummary(gru)
        String multiSummary = service.getSummary(multi)

        then:
        gruSummary.contains(service.GRU_POS)
        !gruSummary.contains(service.HMB_POS)
        !gruSummary.contains(sprintf(service.DS_POS, diseases.join(", ")))
        !gruSummary.contains(service.POA_POS)
        !gruSummary.contains(service.NCU_POS)
        !gruSummary.contains(service.NMDS_POS)
        !gruSummary.contains(service.NCTRL_POS)
        !gruSummary.contains(service.RS_FM_POS)
        !gruSummary.contains(service.RS_M_POS)
        !gruSummary.contains(sprintf(service.RS_POS, populations.join(", ")))
        !gruSummary.contains(service.RS_PD_POS)
        !gruSummary.contains(sprintf(service.DATE_POS, formattedNow))
        !gruSummary.contains(service.AGGREGATE_POS)
        !gruSummary.contains(sprintf(service.RECONTACT_MAY, recontactMay))
        !gruSummary.contains(sprintf(service.RECONTACT_MUST, recontactMust))
        !gruSummary.contains(service.CLOUD_PROHIBITED)
        !gruSummary.contains(service.ETHICS_APPROVAL)
        !gruSummary.contains(sprintf(service.GEO_RESTRICTION, geographicalRestrictions))
        !gruSummary.contains(sprintf(service.OTHER_POS, service.stripTextOfHtml(other)))

        multiSummary.contains(service.GRU_POS)
        multiSummary.contains(service.HMB_POS)
        multiSummary.contains(sprintf(service.DS_POS, diseases.join(", ")))
        multiSummary.contains(service.POA_POS)
        multiSummary.contains(service.NCU_POS)
        multiSummary.contains(service.NMDS_POS)
        multiSummary.contains(service.NCTRL_POS)
        !multiSummary.contains(service.RS_FM_POS)
        multiSummary.contains(service.RS_M_POS)
        multiSummary.contains(sprintf(service.RS_POS, populations.join(", ")))
        multiSummary.contains(service.RS_PD_POS)
        multiSummary.contains(sprintf(service.DATE_POS, formattedNow))
        multiSummary.contains(service.AGGREGATE_POS)
        multiSummary.contains(sprintf(service.RECONTACT_MAY, recontactMay))
        multiSummary.contains(sprintf(service.RECONTACT_MUST, recontactMust))
        multiSummary.contains(service.CLOUD_PROHIBITED)
        multiSummary.contains(service.ETHICS_APPROVAL)
        multiSummary.contains(sprintf(service.GEO_RESTRICTION, geographicalRestrictions))
        multiSummary.contains(sprintf(service.OTHER_POS, service.stripTextOfHtml(other)))
    }

    void "Get Minimized Summary"() {
        given:
        Date now = new Date()
        OntologyService ontologyService = Mock(OntologyService)
        OntologyTerm term = new OntologyTerm(
                id: "id",
                label: "label",
                synonyms: ["synonym"],
                definition: ["definition"],
                obsolete: false,
                type: "type"
        )
        ontologyService.getOntologyClass(*_) >> term
        service.setOntologyService(ontologyService)

        DataUseRestriction gru = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true
        )
        def diseases = ["label"]
        def populations = ["id"]
        def recontactMay = "yes"
        def recontactMust = "yes"
        def geographicalRestrictions = "geo"
        def other = "<p>Other</p>"
        DataUseRestriction multi = new DataUseRestriction(
                consentGroupKey: "OD-TEST",
                consentPIName: "Test",
                generalUse: true,
                hmbResearch: true,
                diseaseRestrictions: diseases,
                populationOriginsAncestry: true,
                commercialUseExcluded: true,
                methodsResearchExcluded: true,
                controlSetOption: "Yes",
                gender: "Male",
                populationRestrictions: populations,
                pediatricLimited: true,
                dateRestriction: now,
                aggregateResearchResponse: "Yes",
                recontactingDataSubjects: true,
                recontactMay: recontactMay,
                recontactMust: recontactMust,
                cloudStorage: "Yes",
                irb: true,
                geographicalRestrictions: geographicalRestrictions,
                other: other
        )

        when:
        String gruSummary = service.getMinimizedSummary(gru)
        String multiSummary = service.getMinimizedSummary(multi)

        then:
        gruSummary.contains("GRU")
        !gruSummary.contains("HMB")
        !gruSummary.contains("DS-")
        !gruSummary.contains("NCU")
        !gruSummary.contains("NMDS")
        !gruSummary.contains("RS-M")
        !gruSummary.contains("RS-F")
        !gruSummary.contains("POP-")
        !gruSummary.contains("RS-PD")
        !gruSummary.contains("Recontacting")
        !gruSummary.contains("Cloud storage")
        !gruSummary.contains("Ethics committed")
        !gruSummary.contains("more information")
        !gruSummary.contains("Other restrictions")

        multiSummary.contains("GRU")
        multiSummary.contains("HMB")
        multiSummary.contains("DS-")
        multiSummary.contains("NCU")
        multiSummary.contains("NMDS")
        multiSummary.contains("RS-M")
        !multiSummary.contains("RS-F")
        multiSummary.contains("POP-")
        multiSummary.contains("RS-PD")
        multiSummary.contains("Recontacting")
        multiSummary.contains("Cloud storage")
        multiSummary.contains("Ethics committed")
        !multiSummary.contains("more information") // other is not > 75 characters long
        multiSummary.contains("Other restrictions")
    }

}
