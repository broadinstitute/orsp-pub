package org.broadinstitute.orsp.utils

import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm
import org.apache.pdfbox.pdmodel.interactive.form.PDField
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.dataUseLetter.DataUseLetterFields
import org.springframework.util.StringUtils

import java.util.regex.Pattern

@Slf4j
class DulPdfParser {
    static PDAcroForm fillDulForm(DataUseLetter dul, PDAcroForm acroForm) {
        Object dulInfoObj = JSON.parse(dul.dulInfo)
        for (PDField field : acroForm.getFields()) {
            String fieldName = field.getFullyQualifiedName()
            switch (fieldName) {
                case DataUseLetterFields.PROTOCOL_TITLE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PROTOCOL_TITLE.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.PROTOCOL_NUMBER.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PROTOCOL_NUMBER.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.CONSENT_FORM_TITLE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.CONSENT_FORM_TITLE.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.PRINCIPAL_INVESTIGATOR.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PRINCIPAL_INVESTIGATOR.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.DATA_MANAGER_NAME.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_MANAGER_NAME.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.DATA_MANAGER_EMAIL.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_MANAGER_EMAIL.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.START_DATE.abbreviation:
                    field.setValue(getDefaultDateValue(dulInfoObj[DataUseLetterFields.START_DATE.abbreviation] as String) )
                    break
                case DataUseLetterFields.END_DATE.abbreviation:
                    field.setValue(getDefaultDateValue(dulInfoObj[DataUseLetterFields.END_DATE.abbreviation] as String))
                    break
                case DataUseLetterFields.ON_GOING_PROCESS.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.ON_GOING_PROCESS.abbreviation] as String))
                    break
                case DataUseLetterFields.REPOSITORY_DEPOSITION.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.REPOSITORY_DEPOSITION.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.REPOSITORY_DEPOSITION.abbreviation].toString())
                    break
                case DataUseLetterFields.PRIMARY_RESTRICTIONS.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.PRIMARY_RESTRICTIONS.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.PRIMARY_RESTRICTIONS.abbreviation].toString())
                    break
                case DataUseLetterFields.PARASITIC_DISEASE.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.PARASITIC_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.CANCER.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.CANCER.abbreviation] as String))
                    break
                case DataUseLetterFields.MENTAL_DISORDER.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.MENTAL_DISORDER.abbreviation] as String))
                    break
                case DataUseLetterFields.NERVOUS_DISEASE.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.NERVOUS_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.RESPIRATORY_DISEASE.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.RESPIRATORY_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.DIGESTIVE_DISEASE.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.DIGESTIVE_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.CARDIOVASCULAR_DISEASE.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.CARDIOVASCULAR_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.OTHER_DISEASE.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.OTHER_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.OTHER_DISEASE_DOID.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.OTHER_DISEASE_DOID.abbreviation][DataUseLetterFields.LABEL.abbreviation].toString().replace('[','').replace(']',''), dul.uid))
                    break
                case DataUseLetterFields.COMMERCIAL_PURPOSES.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.COMMERCIAL_PURPOSES.abbreviation] as String))
                    break
                case DataUseLetterFields.METHODS_RESEARCH.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.METHODS_RESEARCH.abbreviation] as String))
                    break
                case DataUseLetterFields.NO_POPULATION_RESTRICTED.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.NO_POPULATION_RESTRICTED.abbreviation] as String))
                    break
                case DataUseLetterFields.UNDER_18.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.UNDER_18.abbreviation] as String))
                    break
                case DataUseLetterFields.OVER_18.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.OVER_18.abbreviation] as String))
                    break
                case DataUseLetterFields.ONLY_MEN.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.ONLY_MEN.abbreviation] as String))
                    break
                case DataUseLetterFields.ONLY_WOMEN.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.ONLY_WOMEN.abbreviation] as String))
                    break
                case DataUseLetterFields.ETHNIC.abbreviation:
                    field.setValue(parseCheckBoxValue(dulInfoObj[DataUseLetterFields.ETHNIC.abbreviation] as String))
                    break
                case DataUseLetterFields.ETHNIC_SPECIFY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.ETHNIC_SPECIFY.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.OTHER_RESTRICTIONS.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.OTHER_RESTRICTIONS.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.DATA_SUBMISSION_PROHIBITION.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.DATA_SUBMISSION_PROHIBITION.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.DATA_SUBMISSION_PROHIBITION.abbreviation].toString())
                    break
                case DataUseLetterFields.DATA_USE_CONSENT.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.DATA_USE_CONSENT.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.DATA_USE_CONSENT.abbreviation].toString())
                    break
                case DataUseLetterFields.DATA_DEPOSITION_DESCRIBED.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.DATA_DEPOSITION_DESCRIBED.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.DATA_DEPOSITION_DESCRIBED.abbreviation].toString())
                    break
                case DataUseLetterFields.REPOSITORY_TYPE.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.REPOSITORY_TYPE.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.REPOSITORY_TYPE.abbreviation].toString())
                    break
                case DataUseLetterFields.GSR_AVAILABILITY.abbreviation:
                    field.setValue(dulInfoObj[DataUseLetterFields.GSR_AVAILABILITY.abbreviation].toString().isEmpty() ? 'Off' : dulInfoObj[DataUseLetterFields.GSR_AVAILABILITY.abbreviation].toString())
                    break
                case DataUseLetterFields.GSR_AVAILABILITY_SPECIFY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.GSR_AVAILABILITY_SPECIFY.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.PRINTED_NAME.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PRINTED_NAME.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.SIGNATURE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.SIGNATURE.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.POSITION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.POSITION.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.INSTITUTION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.INSTITUTION.abbreviation] as String, dul.uid))
                    break
                case DataUseLetterFields.SUBMITTED_DATE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.SUBMITTED_DATE.abbreviation] as String, dul.uid))
                    break
            }
            field.setReadOnly(true)

        }
        acroForm
    }


    private static String getDefaultValue(String value, String uid){
        StringUtils.isEmpty(value) ? "--" : filterNonPrintableValue(value, uid)
    }

    /**
     * Parse for the checkbox elements created on the PDF form
     * */
    private static String parseCheckBoxValue(String value){
         value == "true" ? "On" : "Off"
    }

    private static String getDefaultDateValue(String value){
        String stringDate
        if (StringUtils.isEmpty(value)) {
            stringDate = "--"
        } else {
            Date date = Date.parse("yyyy-MM-dd'T'HH:mm:ss", value)
            stringDate = date.format("MM-dd-yyyy").toString()
        }
        stringDate
    }

    /**
     * PDFBox has a lot of trouble with non-printable characters. Strip from the PDF content and
     * log a warning so we can follow up with the user and/or clean up the Data Use Letter.
     */
    static String filterNonPrintableValue(String value, String uid) {
        String NON_PRINTABLE_PATTERN = "\\P{Print}"
        if (Pattern.compile(NON_PRINTABLE_PATTERN).matcher(value).find()) {
            log.warn("Value " + value + " from Data Use Letter id: "+ uid + "' contains non-printable characters.")
            return value.replaceAll(NON_PRINTABLE_PATTERN, "")
        }
        return value
    }
}
