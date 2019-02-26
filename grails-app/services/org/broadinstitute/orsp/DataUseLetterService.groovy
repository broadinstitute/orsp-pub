package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional

class DataUseLetterService {
    QueryService queryService

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    DataUseLetter generateDul(DataUseLetter input) {
        DataUseLetter newDul = input

        String uniqueId = UUID.randomUUID().toString()
        newDul.setUid(uniqueId)

        newDul.setSubmitted(false)
        newDul.setCreationDate(new Date())

        newDul.save(flush: true)

        if (newDul.hasErrors()) {
            throw new DomainException(newDul.getErrors())
        } else {
            newDul
        }
    }

    @Transactional
    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def udpateDataUseLetter(DataUseLetter input) {
        DataUseLetter dul = DataUseLetter.findByUid(input.getUid())
        dul.setDulInfo(input.getDulInfo())
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
