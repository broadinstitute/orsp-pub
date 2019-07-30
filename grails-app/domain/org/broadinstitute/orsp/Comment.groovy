package org.broadinstitute.orsp

import com.google.common.base.Splitter
import gorm.logical.delete.LogicalDelete

class Comment  implements LogicalDelete<Comment> {

    String projectKey
    String author
    String description
    Date created

    static constraints = {
        projectKey nullable: false
        author nullable: false
        description nullable: false
        created nullable: false
    }

    /**
     * Format the body of the comment to no larger than 75 contiguous non-whitespace characters.
     *
     * @return Formatted comment string
     */
    String formattedActionBody() {
        def list = []
        Splitter.fixedLength(75).split(description).each {
            list.add(it)
            if (it.matches(/^\S*$/)) { list.add("\n") }
        }
        list.join("")
    }

}
