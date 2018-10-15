package org.broadinstitute.orsp

import grails.testing.gorm.DomainUnitTest
import grails.testing.web.controllers.ControllerUnitTest
import grails.validation.ValidationErrors
import org.springframework.validation.Errors
import org.springframework.validation.ObjectError
import spock.lang.Specification

class AdminControllerSpec extends Specification implements ControllerUnitTest<AdminController>, DomainUnitTest<ConsentCollectionLink> {

    private ConsentCollectionLink mockConsentCollectionLink
    private Issue mockIssue
    private Issue mockConsent
    private SampleCollection mockCollection

    def setup() {
        mockConsentCollectionLink = new ConsentCollectionLink(
                projectKey: "PROJECT_KEY",
                consentKey: "CONSENT_KEY",
                sampleCollectionId: "SC_ID")
        mockIssue = new Issue(projectKey: "PROJECT_KEY", type: IssueType.IRB.name)
        mockConsent = new Issue(projectKey: "CONSENT_KEY", type: IssueType.CONSENT_GROUP.name)
        mockCollection = new SampleCollection(collectionId: "SC_ID")
    }

    def 'Test create consent collection link success'() {
        given:
        controller.queryService = Stub(QueryService) {
            findCollectionLinks(_, _, _) >> []
            findByKey(mockIssue.projectKey) >> mockIssue
            findByKey(mockConsent.projectKey) >> mockConsent
            findCollectionById(mockCollection.collectionId) >> mockCollection
        }
        mockConsentCollectionLink.setCreationDate(new Date())
        controller.persistenceService = Stub(PersistenceService) {
            saveConsentCollectionLink(_, _, _) >> mockConsentCollectionLink
        }

        when:
        request.method = 'POST'
        params['projectKey'] = "PROJECT_KEY"
        params['consentKey'] = "CONSENT_KEY"
        params['sampleCollectionId'] = "SC_ID"
        controller.createConsentCollection()

        then:
        response.status == 201
    }

    def 'Test create consent collection link internal server error'() {
        given:
        controller.queryService = Stub(QueryService) {
            findCollectionLinks(_, _, _) >> []
            findByKey(mockIssue.projectKey) >> mockIssue
            findByKey(mockConsent.projectKey) >> mockConsent
            findCollectionById(mockCollection.collectionId) >> mockCollection
        }
        controller.persistenceService = Stub(PersistenceService) {
            saveConsentCollectionLink(_, _, _) >> { throw new Exception("Blah") }
        }

        when:
        request.method = 'POST'
        params['projectKey'] = "PROJECT_KEY"
        params['consentKey'] = "CONSENT_KEY"
        params['sampleCollectionId'] = "SC_ID"
        controller.createConsentCollection()

        then:
        response.status == 500
    }

    def 'Test create consent collection link field errors'() {
        given:
        controller.queryService = Stub(QueryService) {
            findCollectionLinks(_, _, _) >> []
            findByKey(mockIssue.projectKey) >> mockIssue
            findByKey(mockConsent.projectKey) >> mockConsent
            findCollectionById(mockCollection.collectionId) >> mockCollection
        }
        Errors errors = new ValidationErrors(new ObjectError("projectKey", "Invalid Project Key"))
        mockConsentCollectionLink.setErrors(errors) // Set some errors
        mockConsentCollectionLink.validate()        // Trigger validation so errors are registered on the domain object
        controller.persistenceService = Stub(PersistenceService) {
            saveConsentCollectionLink(_, _, _) >> mockConsentCollectionLink
        }

        when:
        request.method = 'POST'
        params['projectKey'] = "PROJECT_KEY"
        params['consentKey'] = "CONSENT_KEY"
        params['sampleCollectionId'] = "SC_ID"
        controller.createConsentCollection()

        then:
        response.status == 500
    }

    def 'Test create consent collection link bad request'() {
        given:
        controller.queryService = Stub(QueryService) {
            findCollectionLinks(_, _, _) >> []
            findByKey(mockIssue.projectKey) >> mockIssue
            findByKey(mockConsent.projectKey) >> mockConsent
            findCollectionById(mockCollection.collectionId) >> mockCollection
        }

        when:
        request.method = 'POST'
        controller.createConsentCollection()

        then:
        response.status == 400
    }

    def 'Test create consent collection link conflict error: exists'() {
        given:
        controller.queryService = Stub(QueryService) {
            mockConsentCollectionLink.setCreationDate(new Date())
            findCollectionLinks(_, _, _) >> [mockConsentCollectionLink]
            findByKey(mockIssue.projectKey) >> mockIssue
            findByKey(mockConsent.projectKey) >> mockConsent
            findCollectionById(mockCollection.collectionId) >> mockCollection
        }

        when:
        request.method = 'POST'
        params['projectKey'] = "PROJECT_KEY"
        params['consentKey'] = "CONSENT_KEY"
        params['sampleCollectionId'] = "SC_ID"
        controller.createConsentCollection()

        then:
        response.status == 409
    }

    def 'Test create consent collection link conflict error: associated'() {
        given:
        ConsentCollectionLink associated = new ConsentCollectionLink(
                projectKey: "PROJECT_KEY_ 2",
                consentKey: "CONSENT_KEY_2",
                sampleCollectionId: "SC_ID")
        controller.queryService = Stub(QueryService) {
            mockConsentCollectionLink.setCreationDate(new Date())
            findCollectionLinks(_, _, _) >> [mockConsentCollectionLink]
            findCollectionLinksBySample(_) >> [associated]
            findByKey(mockIssue.projectKey) >> mockIssue
            findByKey(mockConsent.projectKey) >> mockConsent
            findCollectionById(mockCollection.collectionId) >> mockCollection
        }

        when:
        request.method = 'POST'
        params['projectKey'] = "PROJECT_KEY"
        params['consentKey'] = "CONSENT_KEY"
        params['sampleCollectionId'] = "SC_ID"
        controller.createConsentCollection()

        then:
        response.status == 409
    }

    def 'Test create consent collection link bad request against invalid project/consent/sample'() {
        given:
        controller.queryService = Stub(QueryService) {
            findCollectionLinks(_, _, _) >> []
            findByKey(_) >> null
            findCollectionById(_) >> null
        }

        when:
        request.method = 'POST'
        params['projectKey'] = "PROJECT_KEY"
        params['consentKey'] = "CONSENT_KEY"
        params['sampleCollectionId'] = "SC_ID"
        controller.createConsentCollection()

        then:
        response.status == 400
    }

}
