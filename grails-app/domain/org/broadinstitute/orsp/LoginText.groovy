package org.broadinstitute.orsp

class LoginText {

    Integer id
    String heading
    String body
    String default_value

    static constraints = {
        heading nullable: true
        body nullable: true
        default_value nullable: true
    }

}
