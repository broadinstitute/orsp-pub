package org.broadinstitute.orsp;

enum SubmissionType {

    Amendment ("Amendment", [IssueType.IRB, IssueType.NE, IssueType.NHSR]),
    ContinuingReview ("Continuing Review", [IssueType.IRB]),
    OtherEvent ("Other Event", [IssueType.IRB]),
    Other ("Other", [IssueType.IRB, IssueType.NE, IssueType.NHSR])

    String label
    Collection<IssueType> issueTypes

    /**
     * @param label Label string
     * @param issueTypes Collection of issue types for which the submission type is applicable
     */
    SubmissionType(String label, Collection<IssueType> issueTypes) {
        this.label = label
        this.issueTypes = issueTypes
    }

    static SubmissionType getForLabel(String label) {
        values().find { it.label.equalsIgnoreCase(label) } ?: null
    }

    static Collection<SubmissionType> getIRBTypes() {
        values().findAll { it.issueTypes.contains(IssueType.IRB) }
    }

    static Collection<SubmissionType> getNonIRBTypes() {
        values().findAll { it.issueTypes.contains(IssueType.NE) || it.issueTypes.contains(IssueType.NHSR) }
    }

}
