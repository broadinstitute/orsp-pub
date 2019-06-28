package org.broadinstitute.orsp

enum CollectionLinkStatus {


    APPROVED("Approved"),
    REJECTED("Rejected"),
    UNLINKED("Unlinked"),
    PENDING("Pending")

    String name

    CollectionLinkStatus(String name) {
        this.name = name
    }
}
