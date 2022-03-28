package org.broadinstitute.orsp

@Singleton
class Fields {

    // TODO: Most of these maps are carry-overs from jira db values.
    // They should be refactored into something less obnoxious like ordered lists

    public static final Map<String, String> AFFILIATION_MAP =
            ["10048": "Broad",
             "10049": "Partners",
             "10050": "DFCI",
             "10051": "MIT",
             "10052": "Children's Hospital",
             "10053": "Harvard",
             "10054": "Other (specify below)"]

    static final Collection<String> affiliationValues(Collection<String> keys) {
        AFFILIATION_MAP.findAll{keys.contains(it.key)}.collect{it.value}
    }

    public static final List<String> FUNDING_SOURCES =
            ["Federal Prime", "Federal Sub-award", "Broad Institutional Award", "Purchase Order", "Corporate Funding", "Foundation", "Philanthropy", "Other"]

    public static final Map<String, String> NOT_RESEARCH_MAP = [
            "10133":"This project does not constitute research.",
            "10134":"This project does not constitute human subjects research."]

    public static final Map<String, String> NOT_HSR_MAP = [
            "10132": "The Broad Institute is not engaged in human subjects research."]

    public static final Map<String, String> SUBMISSION_TYPE_MAP = ["10110":"Initial Determination", "10111":"Clarification Request"]

}
