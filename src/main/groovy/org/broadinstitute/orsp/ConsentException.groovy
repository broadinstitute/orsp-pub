package org.broadinstitute.orsp

import org.codehaus.groovy.GroovyException

class ConsentException extends GroovyException {

    ConsentException(String message) {
        super(message)
    }

}
