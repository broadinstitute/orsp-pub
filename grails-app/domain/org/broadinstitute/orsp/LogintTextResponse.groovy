package org.broadinstitute.orsp

class LogintTextResponse {

    Integer id
    String heading
    String body

    static constraints = {
        id nullable: false
        heading nullable: false
        body nullable: false
    }

}
