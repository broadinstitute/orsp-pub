package org.broadinstitute.orsp

enum IssueStatus {

    // Consent Group Status:
    Open(1, "Open"),

    // IRB Statuses
    PreparingApplication(2, "Preparing Application"),
    GettingSignatures(3, "Getting signatures"),
    IRBConsidering(4, "IRB considering"),
    Approved(5, "Approved"),

    // NE/NHSR Statuses:
    SubmittingToORSP(6, "Submitting to ORSP"),
    ReviewingForm(7, "Reviewing Form"),
    GettingCCOApproval(8, "Getting CCO approval"),
    Completed(9, "Completed"),

    // Global Status:
    Closed(10, "Closed"),
    Abandoned(11, "Abandoned"),
    ProjectApproved(12, "Approved"),
    Pending(13, "Pending ORSP Admin Review"),
    Withdrawn(14, "Withdrawn"),

    Legacy(15, "Legacy"),
    Intake(16, "Intake"),
    Reopened(17, "Reopened")


    Integer sequence
    String name

    IssueStatus(Integer sequence, String name) {
        this.sequence = sequence
        this.name = name
    }

    static defaultStatuses = EnumSet.allOf(IssueStatus).toList().findAll { ![Abandoned, Closed].contains(it) }

}
