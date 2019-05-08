package org.broadinstitute.orsp

class ConsentCollectionDataService {

    ConsentCollectionData create(ConsentCollectionData consentCollectionData) throws DomainException {
        consentCollectionData.save(flush: true)
        consentCollectionData
    }

}
