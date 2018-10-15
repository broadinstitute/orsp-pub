package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.Comment

class CommentSpec extends BaseSpec implements DomainUnitTest<Comment> {

    void testInvalid() {
        given:
        def comment = new Comment()

        when:
        def valid = comment.validate()

        then:
        !valid
    }


    void testValid() {
        given:
        def comment = new Comment(
                author: "Author",
                created: new Date(),
                projectKey: "OD-12345",
                description: "Comment Text"
        )

        when:
        def valid = comment.validate()

        then:
        valid
    }

    void testFormattedBody() {
        given:
        def comment = new Comment(
                author: "Author",
                created: new Date(),
                projectKey: "OD-12345",
                description: "CommentText" * 100
        )

        when:
        def formattedBody = comment.formattedActionBody()
        def lines = formattedBody.split("\n")

        then:
        formattedBody.contains("\n")
        lines.size() > 1
    }

}
