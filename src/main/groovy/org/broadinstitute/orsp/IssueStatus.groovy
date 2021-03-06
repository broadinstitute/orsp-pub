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
    Pending(12, "Pending ORSP Admin Review"),
    Withdrawn(13, "Withdrawn"),

    Legacy(14, "Legacy"),
    Intake(15, "Intake"),
    Reopened(16, "Reopened"),
    Disapproved(17, "Disapproved"),
    OnHold(18, "On Hold")

    Integer sequence
    String name

    IssueStatus(Integer sequence, String name) {
        this.sequence = sequence
        this.name = name
    }

    static defaultStatuses = EnumSet.allOf(IssueStatus).toList().findAll { ![Abandoned, Closed].contains(it) }

}
