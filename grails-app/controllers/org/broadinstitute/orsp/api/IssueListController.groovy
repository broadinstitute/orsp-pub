package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.SupplementalRole
import org.broadinstitute.orsp.utils.IssueUtils

import java.text.SimpleDateFormat

@Slf4j
@Resource
class IssueListController extends AuthenticatedController {

    def getProjectsForUser() {
        try {
            if (params.admin) {
                render projectsForAdmin('', '')  as JSON
            } else {
                SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd")
                List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max)
                render issues.collect{it -> [
                        id               : it.id,
                        projectKey       : it.projectKey,
                        summary          : IssueUtils.escapeQuote(it.summary),
                        status           : IssueUtils.escapeQuote(it.approvalStatus),
                        type             : IssueUtils.escapeQuote(it.type),
                        updateDate       : it.updateDate ? sd.format(it.updateDate) : '',
                        actors           : queryService.findUsersInUserNameList(it.actors)?.collect { it.displayName },
                        assignedAdmin    : it.assignedAdmin,
                        adminComments    : it.adminComments
                ]} as JSON
            }
        } catch(Exception e) {
            handleException(e)
        }
    }

    def issueItems() {
        if (session.user) {
            List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max)
            render(issues as JSON)
        }
    }

    def adminIssueItems() {
        if (session.user) {
            List<Issue> issues = projectsForAdmin((String) params.max, (String) params.admin)
            render(issues as JSON)
        }
    }

    private List<Issue> projectsForUser(String assignee, String max) {
        Collection<String> users = new ArrayList<>([getUser().getUserName()])

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

    private List<Issue> projectsForAdmin(String max, String admin) {

        Integer limit = null
        if (!max?.isEmpty()) {
            limit = max?.toInteger()
        }
        List<String> allAdmins = new LinkedList<String>(Arrays.asList(grailsApplication.config.getProperty('orspAdmins')?.split(",")))
        queryService.findByApprovalStatus(limit, admin, allAdmins)
    }

}
