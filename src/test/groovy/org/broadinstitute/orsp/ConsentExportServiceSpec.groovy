package org.broadinstitute.orsp

import com.google.gson.JsonElement
import com.google.gson.JsonParser
import grails.testing.gorm.DataTest
import grails.testing.services.ServiceUnitTest
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.ConsentConfiguration
import org.broadinstitute.orsp.consent.ConsentResource
import spock.lang.Shared
import spock.lang.Specification

@SuppressWarnings("GroovyAssignabilityCheck")
@Slf4j
class ConsentExportServiceSpec extends Specification implements DataTest, ServiceUnitTest<ConsentExportService>{

    Closure doWithSpring() {{ ->
        consentConfiguration(ConsentConfiguration)
    }}

    Date now = new Date()
    Collection<String> sampleCollectionIds = ["1", "2", "3"]
    @Shared User user
    @Shared DataUseRestriction restriction
    @Shared ConsentService consentService
    @Shared PersistenceService persistenceService
    String consentGroupName ="Test / 5555555"
    String everythingString = "{\"type\":\"everything\"}"
    JsonParser parser = new JsonParser()
    JsonElement everything = parser.parse(everythingString).asJsonObject
    ConsentResource consentResource = new ConsentResource(
            consentId: 1,
            requiresManualReview: false,
            dataUseLetter: "https://gcs.bucket.location/random-UUID",
            useRestriction: everything.asJsonObject,
            name: "ORSP-TEST-1234",
            groupName: "Test / 5555555",
            dulName: "test.txt",
            createDate: now.toTimestamp(),
            lastUpdate: now.toTimestamp(),
            sortDate: now.toTimestamp(),
            translatedUseRestriction: "Everything",
            dataUse: null) // TODO data use

    def setupSpec() {
        mockDomain User
        mockDomain DataUseRestriction
        mockDomain StorageDocument
    }

    def setup() {
        consentService = Mock(ConsentService)
        persistenceService = Mock(PersistenceService)
        service.setConsentService(consentService)
        service.setPersistenceService(persistenceService)
        user = new User(
                id: 1,
                userName: "testUser",
                displayName: "Test User",
                emailAddress: "testUser@nowhere.org")
        restriction = new DataUseRestriction(
                consentGroupKey: "ORSP-TEST-1234",
                consentPIName: user.displayName,
                generalUse: true,
                vaultConsentId: null,
                vaultExportDate: null)
    }

    def cleanup() {
    }

    void "Export new Consent fails to post consent to DUOS"() {
        given:
        consentService.postConsent(_) >> { throw new ConsentException("Error") }

        when:
        service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        def e = thrown(ConsentException)
        e.message == "Error"
    }

    void "Export new Consent fails to post sample collections to DUOS"() {
        given:
        consentService.postConsentAssociations(*_) >> { throw new ConsentException() }

        when:
        service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        def e = thrown(ConsentException)
        e.message == "Unable to create DUOS consent for Consent Group: ORSP-TEST-1234"
    }

    void "Export new Consent with samples"() {
        when:
        ConsentResource resource = service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        1 * consentService.getConsent(*_) >> consentResource
        1 * consentService.buildConsentResource(*_) >> consentResource
        1 * consentService.postConsent(*_) >> "location"
        0 * consentService.updateConsent(*_) >> true
        1 * consentService.postConsentAssociations(*_) >> true
        3 * persistenceService.saveEvent(*_) >> new Event()
        resource != null
    }

    void "Export new Consent with no samples"() {
        when:
        ConsentResource resource = service.exportConsent(user, restriction, null, null)

        then:
        1 * consentService.getConsent(*_) >> consentResource
        1 * consentService.buildConsentResource(*_) >> consentResource
        1 * consentService.postConsent(*_) >> "location"
        0 * consentService.postConsentAssociations(*_) >> true
        1 * persistenceService.saveEvent(*_) >> new Event()
        resource != null
    }

    void "Export updated Consent fails to find consent in DUOS"() {
        given:
        restriction.setVaultConsentId(UUID.randomUUID().toString())
        restriction.setVaultExportDate(now)
        consentService.getConsent(_) >> { throw new ConsentException("Error") }

        when:
        service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        def e = thrown(ConsentException)
        e.message == "Error"
    }

    void "Export updated Consent fails to post consent in DUOS"() {
        given:
        restriction.setVaultConsentId(UUID.randomUUID().toString())
        restriction.setVaultExportDate(now)
        consentService.postConsent(_) >> { throw new ConsentException("Error") }

        when:
        service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        def e = thrown(ConsentException)
        e.message == "Error"
    }

    void "Export updated Consent fails to post sample collections to DUOS"() {
        given:
        restriction.setVaultConsentId(UUID.randomUUID().toString())
        restriction.setVaultExportDate(now)
        consentService.postConsentAssociations(*_) >> { throw new ConsentException() }

        when:
        service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        def e = thrown(ConsentException)
        e.message == "Unable to create DUOS consent for Consent Group: ORSP-TEST-1234"
    }

    void "Export updated Consent with samples"() {
        given:
        restriction.setVaultConsentId(UUID.randomUUID().toString())
        restriction.setVaultExportDate(now)

        when:
        ConsentResource resource = service.exportConsent(user, restriction, sampleCollectionIds, consentGroupName)

        then:
        2 * consentService.getConsent(*_) >> consentResource
        1 * consentService.buildConsentResource(*_) >> consentResource
        0 * consentService.postConsent(*_) >> "location"
        1 * consentService.updateConsent(*_) >> true
        1 * consentService.postConsentAssociations(*_) >> true
        3 * persistenceService.saveEvent(*_) >> new Event()
        resource != null
    }

    void "Export updated Consent with no samples"() {
        given:
        restriction.setVaultConsentId(UUID.randomUUID().toString())
        restriction.setVaultExportDate(now)

        when:
        ConsentResource resource = service.exportConsent(user, restriction, null, null)

        then:
        2 * consentService.getConsent(*_) >> consentResource
        1 * consentService.buildConsentResource(*_) >> consentResource
        0 * consentService.postConsent(*_) >> "location"
        1 * consentService.updateConsent(*_) >> true
        0 * consentService.postConsentAssociations(*_) >> true
        1 * persistenceService.saveEvent(*_) >> new Event()
        resource != null
    }

}
