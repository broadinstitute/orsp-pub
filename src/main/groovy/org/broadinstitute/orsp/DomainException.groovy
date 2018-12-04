package org.broadinstitute.orsp

import org.codehaus.groovy.GroovyException
import org.springframework.validation.Errors
import org.springframework.validation.ObjectError

public class DomainException extends GroovyException {

    private List<ObjectError> errorList

    public DomainException(List<ObjectError> errorList) {
        super(errorList*.defaultMessage?.join("/n"), false)
        this.errorList = errorList ?: Collections.emptyList()
    }

    public DomainException(Errors errors) {
        super(errors.allErrors.join("/n"), false)
        this.errorList = errors.getAllErrors() ?: Collections.emptyList()
    }

}
