package org.broadinstitute.orsp

enum IssueType {

    IRB("IRB Project", "IRB Protocol", "irb", "IRB"),
    NE("'Not Engaged' Project", "'Not Engaged' Project", "ne", "NE"),
    NHSR("NHSR Project", "Not Human Subjects Research", "nhsr", "NHSR"),
    CONSENT_GROUP("Consent Group", "Consent Group Record", "consentGroup", "CG")

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

    static IssueType valueOfController(String controller) {
        values().find { it.controller == controller }
    }

}
