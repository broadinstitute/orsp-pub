package org.broadinstitute.orsp

import gorm.logical.delete.LogicalDelete

class Organization implements LogicalDelete<Organization> {

    Integer id
    String name
    Boolean active

    static constraints = {
        name blank: false, nullable: false
    }

}
