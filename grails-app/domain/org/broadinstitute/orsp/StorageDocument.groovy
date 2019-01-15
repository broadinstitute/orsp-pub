package org.broadinstitute.orsp

import java.text.SimpleDateFormat

class StorageDocument {

    String projectKey
    String uuid
    String fileName
    String fileType
    String mimeType
    String creator
    String username
    String creationDate
    String status
    Integer version

    InputStream inputStream
    Integer statusCode
    String statusMessage
    Date createDate

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
    }

    static mapping = {
        version column: '`version`'
    }

    static transients = ['inputStream', 'statusCode', 'statusMessage', 'createDate']

    def getCreateDate() {
        if (!creationDate) {
            new Date()
        } else {
            new SimpleDateFormat().parse(creationDate)
        }
    }
    
}