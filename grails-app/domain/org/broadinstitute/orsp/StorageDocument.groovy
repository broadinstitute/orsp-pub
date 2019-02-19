package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

import java.text.SimpleDateFormat

class StorageDocument  implements LogicalDelete<StorageDocument> {

    String projectKey
    String uuid
    String fileName
    String fileType
    String mimeType
    String creator
    String username
    String creationDate
    String status
    Long docVersion

    InputStream inputStream
    Integer statusCode
    String statusMessage
    Date createDate
    String documentType

    static constraints = {
        uuid nullable: false, unique: true
        projectKey nullable: false
        fileName nullable: false
        fileType nullable: false
        mimeType nullable: false
        creator nullable: false
        username nullable: false
        creationDate nullable: true
        status nullable: false
        docVersion nullable: false
    }

    static transients = ['inputStream', 'statusCode', 'statusMessage', 'createDate', 'documentType']

    def getCreateDate() {
        if (!creationDate) {
            new Date()
        } else {
            new SimpleDateFormat().parse(creationDate)
        }
    }
    
}