package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

/**
 * This class should handle relatively simple domain class modifications that should be transactional.
 * More complex domain objects such as Issue and StorageDocument that require complex logic should not be handled here
 * and instead should be handled within their respective service classes.
 */
@Slf4j
class PersistenceService {

    void deleteCollectionLinks(Collection<ConsentCollectionLink> links) {
        links.each {
            log.info("Deleting Collection Link: " + it)
            it.delete(flush: true)
        }
    }

    Event saveEvent(String key, String author, String summary, EventType eventType) {
        new Event(
                projectKey: key,
                author: author,
                summary: summary,
                created: new Date(),
                eventType: eventType
        ).save(flush: true)
    }

    Comment saveComment(String key, String author, String description) {
        new Comment(
                projectKey: key,
                author: author,
                description: description,
                created: new Date(),
                updated_author: author,
                updated: new Date()
        ).save(flush: true)
    }

    ConsentCollectionLink saveConsentCollectionLink(String projectKey, String consentKey, String sampleCollectionId) {
        new ConsentCollectionLink(
                projectKey: projectKey,
                consentKey: consentKey,
                sampleCollectionId: sampleCollectionId,
                creationDate: new Date()
        ).save(flush: true)
    }

    ConsentCollectionLink saveConsentCollectionLink(ConsentCollectionLink consentCollectionLink) {
        consentCollectionLink.save(flush: true)
    }

    void deleteCollectionLink(ConsentCollectionLink consentCollectionLink) {
        consentCollectionLink?.delete(flush: true)
    }

    Organization saveOrganization(Organization organization) {
        organization.save(flush: true)
    }

    void deleteOrganization(Organization organization) {
        organization?.delete(flush: true)
    }

    LoginText saveLoginText(LoginText loginText) {
        loginText.save(flush: true)
    }

    /**
     * Updates the existing ConsentCollectionLink in the database.
     * @param consentCollectionLink The ConsentCollectionLink object with updated information.
     * @return The updated ConsentCollectionLink object.
     * @throws Exception If the update operation fails.
     */
    ConsentCollectionLink updateConsentCollectionLink(ConsentCollectionLink consentCollectionLink) {
        try {
            ConsentCollectionLink existingLink = ConsentCollectionLink.findById(consentCollectionLink.id)
            if (existingLink) {
                consentCollectionLink.projectKey = existingLink.projectKey
                consentCollectionLink.creationDate = existingLink.creationDate
                existingLink.consentKey = consentCollectionLink.consentKey
                existingLink.questionnaireVersion = consentCollectionLink.questionnaireVersion
                existingLink.pii = consentCollectionLink.pii
                existingLink.requireMta = consentCollectionLink.requireMta
                existingLink.compliance = consentCollectionLink.compliance
                existingLink.sharingType = consentCollectionLink.sharingType
                existingLink.textSharingType = consentCollectionLink.textSharingType
                existingLink.textCompliance = consentCollectionLink.textCompliance
                existingLink.internationalCohorts = consentCollectionLink.internationalCohorts
                existingLink.publiclyAvailable = consentCollectionLink.publiclyAvailable
                existingLink.store = consentCollectionLink.store
                existingLink.externalAvailability = consentCollectionLink.externalAvailability
                existingLink.textStore = consentCollectionLink.textStore
                existingLink.piiDt = consentCollectionLink.piiDt
                existingLink.phi = consentCollectionLink.phi
                existingLink.genomicData = consentCollectionLink.genomicData
                existingLink.names = consentCollectionLink.names
                existingLink.dates = consentCollectionLink.dates
                existingLink.telephone = consentCollectionLink.telephone
                existingLink.geographicData = consentCollectionLink.geographicData
                existingLink.fax = consentCollectionLink.fax
                existingLink.socialSecurityNumber = consentCollectionLink.socialSecurityNumber
                existingLink.emailAddresses = consentCollectionLink.emailAddresses
                existingLink.medicalNumbers = consentCollectionLink.medicalNumbers
                existingLink.accountNumbers = consentCollectionLink.accountNumbers
                existingLink.healthPlanNumbers = consentCollectionLink.healthPlanNumbers
                existingLink.licenseNumbers = consentCollectionLink.licenseNumbers
                existingLink.vehicleIdentifiers = consentCollectionLink.vehicleIdentifiers
                existingLink.webUrls = consentCollectionLink.webUrls
                existingLink.deviceIdentifiers = consentCollectionLink.deviceIdentifiers
                existingLink.internetProtocolAddresses = consentCollectionLink.internetProtocolAddresses
                existingLink.facePhotos = consentCollectionLink.facePhotos
                existingLink.biometricIdentifiers = consentCollectionLink.biometricIdentifiers
                existingLink.uniqueIdentifying = consentCollectionLink.uniqueIdentifying
                existingLink.otherIdentifier = consentCollectionLink.otherIdentifier
                existingLink.textOtherIdentifier = consentCollectionLink.textOtherIdentifier
                existingLink.startDate = consentCollectionLink.startDate
                existingLink.endDate = consentCollectionLink.endDate
                existingLink.onGoingProcess = consentCollectionLink.onGoingProcess
                existingLink.status = consentCollectionLink.status
                existingLink.linkedProject = consentCollectionLink.linkedProject
                existingLink.sampleCollection = consentCollectionLink.sampleCollection
                existingLink.restriction = consentCollectionLink.restriction
                existingLink.dataSecondaryUse = consentCollectionLink.dataSecondaryUse
                existingLink.collaboratorApproval = consentCollectionLink.collaboratorApproval
                existingLink.mtaOrDta = consentCollectionLink.mtaOrDta
                existingLink.deliveryDate = consentCollectionLink.deliveryDate
                existingLink.releaseDate = consentCollectionLink.releaseDate
                existingLink.updatedDate = new Date()
                existingLink.save(flush: true, failOnError: true)
            } else {
                throw new Exception("ConsentCollectionLink not found for ID: ${consentCollectionLink.id}")
            }
        } catch (Exception e) {
            log.error("Error updating ConsentCollectionLink: " + e.message)
            throw e
        }
    }

}
