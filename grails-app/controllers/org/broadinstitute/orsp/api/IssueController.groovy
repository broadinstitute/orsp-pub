package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.SupplementalRole
import org.broadinstitute.orsp.utils.IssueUtils

@Slf4j
@Resource
class IssueController extends AuthenticatedController {

//    def list() {
//        final List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max)
//        [issues: issues, assignee: params.assignee, header: params.header]
//    }

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


    def getProjectsForUser() {
        try {
            render projectsForUser((String) params.assignee, (String) params.max) as JSON
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }

    }
}