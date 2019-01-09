package org.broadinstitute.orsp

enum DocumentStatus {
    APPROVED("Approved"),
    REJECTED("Rejected"),
    PENDING("Pending"),
    LEGACY("Legacy")

    String status

    DocumentStatus(String status) {
        this.status = status
    }
}
