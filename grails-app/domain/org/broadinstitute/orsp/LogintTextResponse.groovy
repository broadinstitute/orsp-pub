package org.broadinstitute.orsp

class LogintTextResponse {

    Integer id
    String responses

    static constraints = {
        id nullable: false
        responses nullable: false
    }

}
