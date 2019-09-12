package org.broadinstitute.orsp

class Error {

    String message
    Integer code

    public Error(Integer code, String message) {
        this.code = code
        this.message = message
    }
}
