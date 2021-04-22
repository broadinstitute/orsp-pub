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
                created: new Date()
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

    Organization saveOrganization(Integer id, String name, Boolean active) {
        new Organization(
                id: id,
                name: name,
                active: active
        ).save(flush: true)
    }

}
