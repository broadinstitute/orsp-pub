package org.broadinstitute.orsp

enum CollectionLinkStatus {


    Approved("Approved"),
    Rejected("Rejected"),
    Unlinked("Unlinked"),
    Pending("Pending")

    String name

    CollectionLinkStatus(String name) {
        this.name = name
    }
}
