package org.broadinstitute.orsp.domain

import grails.testing.gorm.DomainUnitTest
import org.broadinstitute.orsp.BaseSpec
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus

import static org.junit.Assert.assertTrue

class IssueSpec extends BaseSpec implements DomainUnitTest<Issue> {

    void testValid() {
        given:
        Issue issue = new Issue(
                projectKey: "Key",
                type: IssueType.IRB.name,
                status: IssueStatus.PreparingApplication,
                summary: "Summary",
                description: null,
                reporter: null,
                requestDate: new Date(),
                updateDate: null
        )

        when:
        def valid = issue.validate()
        def controller = issue.getController()
        def typeLabel = issue.getTypeLabel()

        then:
        valid
        !controller.isEmpty()
        !typeLabel.isEmpty()
    }

    void testInvalid() {
        given:
        Issue issue = new Issue()

        when:
        def valid = issue.validate()
        def controller = issue.getController()
        def typeLabel
        try { typeLabel = issue.getTypeLabel() } catch (NullPointerException ignored) {}

        then:
        !valid
        controller.isEmpty()
        typeLabel == null
    }

    void testIssueStatuses() {
        when:
        def statuses = IssueStatus.defaultStatuses.toList()

        then:
        assertTrue(!statuses.contains(IssueStatus.Abandoned))
        assertTrue(!statuses.contains(IssueStatus.Closed))
        assertTrue(statuses.contains(IssueStatus.Approved))
        assertTrue(statuses.contains(IssueStatus.GettingSignatures))
    }


}
