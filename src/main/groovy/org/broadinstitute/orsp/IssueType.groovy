package org.broadinstitute.orsp

enum IssueType {

    IRB("IRB Project", "IRB Protocol", "irb", "IRB"),
    NE("'Not Engaged' Project", "'Not Engaged' Project", "ne", "NE"),
    NHSR("NHSR Project", "Not Human Subjects Research", "nhsr", "NHSR"),
    CONSENT_GROUP("Consent Group", "Consent Group Record", "consentGroup", "CG"),
    EX("Exempt Project", "Exempt", "ex", "EX"),
    SAMPLE_DATA_COHORTS("Sample/Data Cohort", "Sample/Data Cohort Record", "consentGroup", "SDC")

    String name
    String label
    String controller
    String prefix

    IssueType(String name, String label, String controller, String prefix) {
        this.name = name
        this.label = label
        this.controller = controller
        this.prefix = prefix
    }

    static IssueType valueOfName(String name) {
        values().find { it.name == name }
    }

    static IssueType valueOfPrefix(String prefix) {
        values().find { it.prefix == prefix }
    }

    static IssueType valueOfController(String controller) {
        values().find { it.controller == controller }
    }

}
