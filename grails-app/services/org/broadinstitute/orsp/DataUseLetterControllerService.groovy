package org.broadinstitute.orsp
import grails.gorm.transactions.Transactional
import java.util.Date

class DataUseLetterControllerService {

    DataUseLetter generateLink(Object input) {
        DataUseLetter newDul = new DataUseLetter()

        def uniqueId = UUID.randomUUID().toString()

        newDul.setUid(uniqueId)
        newDul.setConsentGroupKey(input.getAt("consentKey") as String)
        newDul.setProjectKey(input.getAt("projectKey") as String)
        newDul.setCreationDate(new Date())
        newDul.save(flush:true)
//        newDul.setCreator(input.getAt("user"))
        return newDul

    }


}
