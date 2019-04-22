package org.broadinstitute.orsp.dataUseLetter

enum DataUseLetterFields {
    UID("uid"),
    PROTOCOL_TITLE("protocolTitle"),
    PROTOCOL_NUMBER("protocolNumber"),
    CONSENT_FORM_TITLE("consentFormTitle"),
    PRINCIPAL_INVESTIGATOR("principalInvestigator"),
    DATA_MANAGER_NAME("dataManagerName"),
    DATA_MANAGER_EMAIL("dataManagerEmail"),
    START_DATE("startDate"),
    END_DATE("endDate"),
    ON_GOING_PROCESS("onGoingProcess"),
    REPOSITORY_DEPOSITION("repositoryDeposition"),
    PRIMARY_RESTRICTIONS("primaryRestrictions"),
    NO_RESTRICTIONS("noRestrictions"),
    GENERAL_USE("generalUse"),
    RESEARCH_RESTRICTED("researchRestricted"),
    DISEASE_RESTRICTED("diseaseRestricted"),
    DISEASE_RESTRICTED_OPTIONS("diseaseRestrictedOptions"),
    PARASITIC_DISEASE("parasiticDisease"),
    CANCER("cancer"),
    MENTAL_DISORDER("mentalDisorder"),
    NERVOUS_DISEASE("nervousDisease"),
    RESPIRATORY_DISEASE("respiratoryDisease"),
    DIGESTIVE_DISEASE("digestiveDisease"),
    CARDIOVASCULAR_DISEASE("cardiovascularDisease"),
    OTHER_DISEASE("otherDisease"),
    OTHER_DISEASE_ID("otherDiseasesID"),
    COMMERCIAL_PURPOSES("commercialPurposes"),
    METHODS_RESEARCH("methodsResearch"),
    NO_POPULATION_RESTRICTED("noPopulationRestricted"),
    UNDER_18("under18"),
    OVER_18("over18"),
    ONLY_MEN("onlyMen"),
    ONLY_WOMEN("onlyWomen"),
    ETHNIC("ethnic"),
    ETHNIC_SPECIFY("ethnicSpecify"),
    OTHER_RESTRICTIONS("otherRestrictions"),
    DATA_SUBMISSION_PROHIBITION("dataSubmissionProhibition"),
    DATA_USE_CONSENT("dataUseConsent"),
    DATA_DEPOSITION_DESCRIBED("dataDepositionDescribed"),
    REPOSITORY_TYPE("repositoryType"),
    GSR_AVAILABILITY("GSRAvailability"),
    GSR_AVAILABILITY_SPECIFY("GSRAvailabilitySpecify"),
    PRINTED_NAME("printedName"),
    SIGNATURE("signature"),
    POSITION("position"),
    INSTITUTION("institution"),
    SUBMITTED_DATE("date"),
    LABEL("label")

    String abbreviation
    private DataUseLetterFields(String abbreviation) {
        this.abbreviation = abbreviation
    }

    List<String> getDataUseLetterFieldsList () {
        List<String> defaultValueFields = [
            PROTOCOL_TITLE.abbreviation,
            PROTOCOL_NUMBER.abbreviation,
            CONSENT_FORM_TITLE.abbreviation,
            PRINCIPAL_INVESTIGATOR.abbreviation,
            DATA_MANAGER_NAME.abbreviation,
            DATA_MANAGER_EMAIL.abbreviation,
            START_DATE.abbreviation,
            END_DATE.abbreviation,
            ON_GOING_PROCESS.abbreviation,
            REPOSITORY_DEPOSITION.abbreviation,
            PRIMARY_RESTRICTIONS.abbreviation,
            NO_RESTRICTIONS.abbreviation,
            GENERAL_USE.abbreviation,
            RESEARCH_RESTRICTED.abbreviation,
            DISEASE_RESTRICTED.abbreviation,
            DISEASE_RESTRICTED_OPTIONS.abbreviation,
            PARASITIC_DISEASE.abbreviation,
            CANCER.abbreviation,
            ENDOCRINE_DISEASE.abbreviation,
            ENDOCRINE_DIABETES.abbreviation,
            MENTAL_DISORDER.abbreviation,
            NERVOUS_DISEASE.abbreviation,
            EYE_DISEASE.abbreviation,
            EAR_DISEASE.abbreviation,
            RESPIRATORY_DISEASE.abbreviation,
            DIGESTIVE_DISEASE.abbreviation,
            INFLAMMATORY_DISEASE.abbreviation,
            SKIN_DISEASE.abbreviation,
            MUSCULO_SKELETAL_DISEASE.abbreviation,
            GENITOURINARY_DISEASE.abbreviation,
            CARDIOVASCULAR_DISEASE.abbreviation,
            PREGNANCY.abbreviation,
            CONGENITAL_MALFORMATION.abbreviation,
            BLOOD_DISORDER.abbreviation,
            OTHER_DISEASE.abbreviation,
            OTHER_DISEASE_SPECIFY.abbreviation,
            COMMERCIAL_PURPOSES.abbreviation,
            METHODS_RESEARCH.abbreviation,
            NO_POPULATION_RESTRICTED.abbreviation,
            UNDER_18.abbreviation,
            OVER_18.abbreviation,
            ONLY_MEN.abbreviation,
            ONLY_WOMEN.abbreviation,
            ETHNIC.abbreviation,
            ETHNIC_SPECIFY.abbreviation,
            OTHER_RESTRICTIONS.abbreviation,
            DATA_SUBMISSION_PROHIBITION.abbreviation,
            DATA_USE_CONSENT.abbreviation,
            DATA_DEPOSITION_DESCRIBED.abbreviation,
            REPOSITORY_TYPE.abbreviation,
            GSR_AVAILABILITY.abbreviation,
            GSR_AVAILABILITY_SPECIFY.abbreviation,
            PRINTED_NAME.abbreviation,
            SIGNATURE.abbreviation,
            POSITION.abbreviation,
            INSTITUTION.abbreviation,
            SUBMITTED_DATE.abbreviation
        ]
    }
}
