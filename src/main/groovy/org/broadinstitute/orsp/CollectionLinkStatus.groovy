package org.broadinstitute.orsp

enum CollectionLinkStatus {


    APPROVED("Approved"),
    REJECTED("Rejected"),
    UNLINKED("Unlinked"),
    PENDING("Pending"),
    SUBMITTED_TO_IRB("PendingIRBReview")

    String name

    CollectionLinkStatus(String name) {
        this.name = name
    }
}
