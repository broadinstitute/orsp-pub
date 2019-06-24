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
    Disapproved(13, "Disapproved"),
    Withdrawn(14, "Withdrawn"),

    Rejected(15, "Rejected"),
    Unlinked(16, "Unlinked"),
    Pending(17, "Pending")

    Integer sequence
    String name

    IssueStatus(Integer sequence, String name) {
        this.sequence = sequence
        this.name = name
    }

    static defaultStatuses = EnumSet.allOf(IssueStatus).toList().findAll { ![Abandoned, Closed].contains(it) }

}
