package org.broadinstitute.orsp

import groovy.util.logging.Slf4j

@Slf4j
class ConsentCollectionLinkService {

    ConsentCollectionLink save(ConsentCollectionLink consentCollectionLink) {
        consentCollectionLink.save(flush: true)
    }

    void delete(ConsentCollectionLink consentCollectionLink) {
        consentCollectionLink?.delete(flush: true)
    }
}

