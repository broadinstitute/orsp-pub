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
            SimpleDateFormat sd = new SimpleDateFormat("yyyy-MM-dd")
            List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max, (String) params.admin)
            render issues.collect{it -> [
                    id               : it.id,
                    projectKey       : it.projectKey,
                    summary          : IssueUtils.escapeQuote(it.summary),
                    status           : IssueUtils.escapeQuote(it.approvalStatus),
                    type             : IssueUtils.escapeQuote(it.type),
                    updateDate       : it.updateDate ? sd.format(it.updateDate) : '',
                    actors           : queryService.findUsersInUserNameList(it.actors)?.collect { it.displayName },
                    assignedAdmin    : it.assignedAdmin
            ]} as JSON
        } catch(Exception e) {
            handleException(e)
        }
    }

    def issueItems() {
        if (session.user && !isAdmin()) {
            List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max, (String) params.admin)
            render(issues as JSON)
        } else if (session.user && isAdmin()) {
            List<Issue> issues = projectsForUser((String) params.assignee, (String) params.max, (String) params.admin)
            render(issues as JSON)
        }
    }

    private List<Issue> projectsForUser(String assignee, String max, String admin) {
        Collection<String> users = new ArrayList<>([getUser().getUserName()])
        if (isAdmin()) {
            if (StringUtils.isNotBlank(admin)) {
                users.addAll([SupplementalRole.ORSP])
                users.add(admin)
            } else {
                users.addAll([SupplementalRole.ORSP, SupplementalRole.ADMIN])
            }

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
            List<String> allAdmins = new LinkedList<String>(Arrays.asList(grailsApplication.config.getProperty('orspAdmins')?.split(",")))
            queryService.findByAssignee(users, limit, admin, allAdmins)
        } else {
            queryService.findByUserNames(users, limit)
        }
    }

}
