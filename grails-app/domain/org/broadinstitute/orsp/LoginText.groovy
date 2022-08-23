package org.broadinstitute.orsp

class LoginText {

    Integer id
    String heading
    String body
    String showMessage

    static constraints = {
        heading nullable: true
        body nullable: true
        showMessage nullable: false
    }

}
