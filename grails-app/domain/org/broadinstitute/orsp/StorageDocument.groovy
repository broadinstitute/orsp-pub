package org.broadinstitute.orsp

import java.text.SimpleDateFormat

/**
 *
 * Created: 10/15/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
class StorageDocument {

    String projectKey
    String uuid
    String fileName
    String fileType
    String mimeType
    String creator
    String username
    String creationDate

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