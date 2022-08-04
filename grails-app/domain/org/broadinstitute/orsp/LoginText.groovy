package org.broadinstitute.orsp

class LoginText {

    Integer id
    String heading
    String body

    static constraints = {
        heading nullable: false
        body nullable: false
    }

}
