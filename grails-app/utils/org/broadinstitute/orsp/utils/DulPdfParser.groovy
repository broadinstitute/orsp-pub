package org.broadinstitute.orsp.utils

import grails.converters.JSON
import org.apache.pdfbox.pdmodel.interactive.form.PDAcroForm
import org.apache.pdfbox.pdmodel.interactive.form.PDField
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.dataUseLetter.DataUseLetterFields
import org.springframework.util.StringUtils

class DulPdfParser {
    static PDAcroForm fillDulForm(DataUseLetter dul, PDAcroForm acroForm) {
        Object dulInfoObj = JSON.parse(dul.dulInfo)
        for (PDField field : acroForm.getFields()) {
            String fieldName = field.getFullyQualifiedName()
            switch (fieldName) {
                case DataUseLetterFields.PROTOCOL_TITLE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PROTOCOL_TITLE.abbreviation] as String))
                    break
                case DataUseLetterFields.PROTOCOL_NUMBER.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PROTOCOL_NUMBER.abbreviation] as String))
                    break
                case DataUseLetterFields.CONSENT_FORM_TITLE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.CONSENT_FORM_TITLE.abbreviation] as String))
                    break
                case DataUseLetterFields.PRINCIPAL_INVESTIGATOR.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PRINCIPAL_INVESTIGATOR.abbreviation] as String))
                    break
                case DataUseLetterFields.DATA_MANAGER_NAME.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_MANAGER_NAME.abbreviation] as String))
                    break
                case DataUseLetterFields.DATA_MANAGER_EMAIL.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_MANAGER_EMAIL.abbreviation] as String))
                    break
                case DataUseLetterFields.START_DATE.abbreviation:
                    field.setValue(getDefaultDateValue(dulInfoObj[DataUseLetterFields.START_DATE.abbreviation] as String))
                    break
                case DataUseLetterFields.END_DATE.abbreviation:
                    field.setValue(getDefaultDateValue(dulInfoObj[DataUseLetterFields.END_DATE.abbreviation] as String))
                    break
                case DataUseLetterFields.ON_GOING_PROCESS.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.ON_GOING_PROCESS.abbreviation] as String))
                    break
                case DataUseLetterFields.REPOSITORY_DEPOSITION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.REPOSITORY_DEPOSITION.abbreviation] as String))
                    break
                case DataUseLetterFields.NO_RESTRICTIONS.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.NO_RESTRICTIONS.abbreviation] as String))
                    break
                case DataUseLetterFields.GENERAL_USE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.GENERAL_USE.abbreviation] as String))
                    break
                case DataUseLetterFields.RESEARCH_RESTRICTED.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.RESEARCH_RESTRICTED.abbreviation] as String))
                    break
                case DataUseLetterFields.DISEASE_RESTRICTED.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED.abbreviation] as String))
                    break
                case DataUseLetterFields.PARASITIC_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.PARASITIC_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.CANCER.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.CANCER.abbreviation] as String))
                    break
                case DataUseLetterFields.ENDOCRINE_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.ENDOCRINE_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.ENDOCRINE_DIABETES.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.ENDOCRINE_DIABETES.abbreviation] as String))
                    break
                case DataUseLetterFields.MENTAL_DISORDER.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.MENTAL_DISORDER.abbreviation] as String))
                    break
                case DataUseLetterFields.NERVOUS_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.NERVOUS_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.EYE_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.EYE_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.EAR_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.EAR_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.RESPIRATORY_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.RESPIRATORY_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.DIGESTIVE_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.DIGESTIVE_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.INFLAMMATORY_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.INFLAMMATORY_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.SKIN_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.SKIN_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.MUSCULO_SKELETAL_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.MUSCULO_SKELETAL_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.GENITOURINARY_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.GENITOURINARY_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.CARDIOVASCULAR_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.CARDIOVASCULAR_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.PREGNANCY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.PREGNANCY.abbreviation] as String))
                    break
                case DataUseLetterFields.CONGENITAL_MALFORMATION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.CONGENITAL_MALFORMATION.abbreviation] as String))
                    break
                case DataUseLetterFields.BLOOD_DISORDER.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.BLOOD_DISORDER.abbreviation] as String))
                    break
                case DataUseLetterFields.OTHER_DISEASE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DISEASE_RESTRICTED_OPTIONS.abbreviation][DataUseLetterFields.OTHER_DISEASE.abbreviation] as String))
                    break
                case DataUseLetterFields.OTHER_DISEASE_SPECIFY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.OTHER_DISEASE_SPECIFY.abbreviation] as String))
                    break
                case DataUseLetterFields.COMMERCIAL_PURPOSES.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.COMMERCIAL_PURPOSES.abbreviation] as String))
                    break
                case DataUseLetterFields.METHODS_RESEARCH.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.METHODS_RESEARCH.abbreviation] as String))
                    break
                case DataUseLetterFields.NO_POPULATION_RESTRICTED.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.NO_POPULATION_RESTRICTED.abbreviation] as String))
                    break
                case DataUseLetterFields.UNDER_18.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.UNDER_18.abbreviation] as String))
                    break
                case DataUseLetterFields.OVER_18.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.OVER_18.abbreviation] as String))
                    break
                case DataUseLetterFields.ONLY_MEN.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.ONLY_MEN.abbreviation] as String))
                    break
                case DataUseLetterFields.ONLY_WOMEN.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.ONLY_WOMEN.abbreviation] as String))
                    break
                case DataUseLetterFields.ETHNIC.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.ETHNIC.abbreviation] as String))
                    break
                case DataUseLetterFields.ETHNIC_SPECIFY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.ETHNIC_SPECIFY.abbreviation] as String))
                    break
                case DataUseLetterFields.OTHER_RESTRICTIONS.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.OTHER_RESTRICTIONS.abbreviation] as String))
                    break
                case DataUseLetterFields.DATA_SUBMISSION_PROHIBITION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_SUBMISSION_PROHIBITION.abbreviation] as String))
                    break
                case DataUseLetterFields.DATA_USE_CONSENT.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_USE_CONSENT.abbreviation] as String))
                    break
                case DataUseLetterFields.DATA_DESPOSITION_DESCRIBED.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.DATA_DESPOSITION_DESCRIBED.abbreviation] as String))
                    break
                case DataUseLetterFields.REPOSITORY_TYPE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.REPOSITORY_TYPE.abbreviation] as String))
                    break
                case DataUseLetterFields.GSR_AVAILABILITY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.GSR_AVAILABILITY.abbreviation] as String))
                    break
                case DataUseLetterFields.GCR_AVAILABILITY_SPECIFY.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.GCR_AVAILABILITY_SPECIFY.abbreviation] as String))
                    break
                case DataUseLetterFields.PRINTED_NAME.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.PRINTED_NAME.abbreviation] as String))
                    break
                case DataUseLetterFields.SIGNATURE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.SIGNATURE.abbreviation] as String))
                    break
                case DataUseLetterFields.POSITION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.POSITION.abbreviation] as String))
                    break
                case DataUseLetterFields.INSTITUTION.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.INSTITUTION.abbreviation] as String))
                    break
                case DataUseLetterFields.SUBMITTED_DATE.abbreviation:
                    field.setValue(getDefaultValue(dulInfoObj[DataUseLetterFields.SUBMITTED_DATE.abbreviation] as String))
                    break
            }
            field.setReadOnly(true)

        }
        acroForm
    }


    private static String getDefaultValue(String value){
        StringUtils.isEmpty(value) ? "--" : value
    }

    private static String getDefaultDateValue(String value){
        StringUtils.isEmpty(value) ? "--" : value.substring(0, value.indexOf('T'))
    }

}
