package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    List<String> getIssueCollaborators(IssueSearchItemDTO issue) {
      issue.extraProperties.get(IssueExtraProperty.COLLABORATOR) ?
              issue.extraProperties.get(IssueExtraProperty.COLLABORATOR) : []
    }

    // get issue's pms as a List<String>
    List<String> getIssuePMs(IssueSearchItemDTO issue) {
      issue.extraProperties.get(IssueExtraProperty.PM) ?
              issue.extraProperties.get(IssueExtraProperty.PM) : []
    }

    // get issue's pis as a List<String>
     List<String> getIssuePIs(IssueSearchItemDTO issue) {
      issue.extraProperties.get(IssueExtraProperty.PI) ?
              issue.extraProperties.get(IssueExtraProperty.PI) : []
    }

    // verifies if logged user belongs to some user list ....
    def issueIsForbidden(IssueSearchItemDTO issue, String userName, boolean isAdmin, boolean isViewer) {

        boolean userHasAccess = (issue.reporter == userName
                || getIssueCollaborators(issue).indexOf(userName)
                || getIssuePMs(issue).indexOf(userName)
                || getIssuePIs(issue).indexOf(userName)
                || isAdmin
                || isViewer)

      !userHasAccess
    }
}

