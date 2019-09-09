package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.utils.IssueUtils
import grails.converters.JSON

@Slf4j
class IssueListController extends AuthenticatedController {

    def index() {
        list()
    }

    def list() {
        final List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max)
        [issues: issues, assignee: params.assignee, header: params.header]
    }

    private List<Issue> projectsForUser(String assignee, String max) {
        Collection<String> users = new ArrayList<>([getUser().getUserName()])
        if (isORSP()) {
            users.add(SupplementalRole.ORSP)
        }

        if (isComplianceOffice()) {
            users.add(SupplementalRole.COMPLIANCE_OFFICE)
        }

        if (isViewer()) {
            users.add(SupplementalRole.READ_ONLY_ADMIN)
        }

        Integer limit = null
        if (!max?.isEmpty()) {
            limit = max?.toInteger()
        }
        if (assignee == "true") {
            queryService.findByAssignee(users, limit)
        } else {
            queryService.findByUserNames(users, limit)
        }
    }

    private static String escapeQuote(String str) {
        if (str != null) {
            str.replaceAll('"', '\\"')
        } else {
            ""
        }
    }

    def issueItems() {
        if (session.user) {
            List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max)
            render(issues as JSON)
        }
    }

}
