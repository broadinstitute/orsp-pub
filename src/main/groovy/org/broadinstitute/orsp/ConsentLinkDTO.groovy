package org.broadinstitute.orsp

class ConsentLinkDTO {

    Integer id
    String projectKey
    String status
    String summary
    String description
    Collection<StorageDocument> attachments

    ConsentLinkDTO(Integer id, String projectKey, String status, String summary, String description, List<StorageDocument> attachments) {
        this.id = id
        this.projectKey = projectKey
        this.status = status
        this.summary = summary
        this.description = description
        this.attachments = attachments
    }

}
