package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

class DataUseLetterService {
    QueryService queryService

    String generateDul(Object input) {
        DataUseLetter newDul = new DataUseLetter()

        String uniqueId = UUID.randomUUID().toString()

        newDul.setUid(uniqueId)
        newDul.setCreator(input["user"] as String)

        newDul.setConsentGroupKey(input["consentKey"] as String)
        newDul.setSubmitted(false)
        newDul.setCreationDate(new Date())

        newDul.save(flush: true)

        if (newDul.hasErrors()) {
            throw new DomainException(newDul.getErrors())
        } else {
            newDul.uid
        }
    }

    @Transactional
    def udpateDataUseLetter(Object input) {

        DataUseLetter dul = DataUseLetter.findByUid(input.uid)
        if (dul != null && !dul.submitted) {
            dul.setSubmitted(true)
            dul.setDulInfo(input.dulInfo as String)
            dul.setSubmitDate(new Date())
            dul.save(flush:true)

            if (dul.hasErrors()) {
                throw new DomainException(dul.getErrors())
            }
            dul
        } else {
            throw new IllegalArgumentException()
        }
    }

}
