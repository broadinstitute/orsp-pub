package org.broadinstitute.orsp

class SampleDataCohortsDTO {
    Long id
    String projectKey
    String type
    String status
    String summary
    String description
    String reporter
    String approvalStatus
    String requestDate
    String updateDate
    String expirationDate
    String attachments
    String extraProperties
    String fundings
    String title
    String consentCollectionStatus

    SampleDataCohortsDTO(Long id, String projectKey, String type, String status, String summary, String description, String reporter, String approvalStatus, String requestDate, String updateDate, String expirationDate, String attachments, String extraProperties, String fundings, String title, String consentCollectionStatus) {
        this.id = id
        this.projectKey = projectKey
        this.type = type
        this.status = status
        this.summary = summary
        this.description = description
        this.reporter = reporter
        this.approvalStatus = approvalStatus
        this.requestDate = requestDate
        this.updateDate = updateDate
        this.expirationDate = expirationDate
        this.attachments = attachments
        this.extraProperties = extraProperties
        this.fundings = fundings
        this.title = title
        this.consentCollectionStatus = consentCollectionStatus
    }

    Long getId() {
        return id
    }

    void setId(Long id) {
        this.id = id
    }

    String getProjectKey() {
        return projectKey
    }

    void setProjectKey(String projectKey) {
        this.projectKey = projectKey
    }

    String getType() {
        return type
    }

    void setType(String type) {
        this.type = type
    }

    String getStatus() {
        return status
    }

    void setStatus(String status) {
        this.status = status
    }

    String getSummary() {
        return summary
    }

    void setSummary(String summary) {
        this.summary = summary
    }

    String getDescription() {
        return description
    }

    void setDescription(String description) {
        this.description = description
    }

    String getReporter() {
        return reporter
    }

    void setReporter(String reporter) {
        this.reporter = reporter
    }

    String getApprovalStatus() {
        return approvalStatus
    }

    void setApprovalStatus(String approvalStatus) {
        this.approvalStatus = approvalStatus
    }

    String getRequestDate() {
        return requestDate
    }

    void setRequestDate(String requestDate) {
        this.requestDate = requestDate
    }

    String getUpdateDate() {
        return updateDate
    }

    void setUpdateDate(String updateDate) {
        this.updateDate = updateDate
    }

    String getExpirationDate() {
        return expirationDate
    }

    void setExpirationDate(String expirationDate) {
        this.expirationDate = expirationDate
    }

    String getAttachments() {
        return attachments
    }

    void setAttachments(String attachments) {
        this.attachments = attachments
    }

    String getExtraProperties() {
        return extraProperties
    }

    void setExtraProperties(String extraProperties) {
        this.extraProperties = extraProperties
    }

    String getFundings() {
        return fundings
    }

    void setFundings(String fundings) {
        this.fundings = fundings
    }

    String getTitle() {
        return title
    }

    void setTitle(String title) {
        this.title = title
    }

    String getConsentCollectionStatus() {
        return consentCollectionStatus
    }

    void setConsentCollectionStatus(String consentCollectionStatus) {
        this.consentCollectionStatus = consentCollectionStatus
    }
}
