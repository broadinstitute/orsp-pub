package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    boolean getIssueCollaborators(IssueSearchItemDTO issue) {
      issue.extraProperties.containsKey(IssueExtraProperty.COLLABORATOR)
    }

    // get issue's pms as a List<String>
    boolean getIssuePMs(IssueSearchItemDTO issue) {
      issue.extraProperties.containsKey(IssueExtraProperty.PM)
    }

    // get issue's pis as a List<String>
     boolean getIssuePIs(IssueSearchItemDTO issue) {
      issue.extraProperties.containsKey(IssueExtraProperty.PI)
    }

    // verifies if logged user belongs to some user list ....
    def issueIsForbidden(IssueSearchItemDTO issue, String userName, boolean isAdmin, boolean isViewer) {

        boolean userHasAccess = (issue.reporter == userName
                || getIssueCollaborators(issue)
                || getIssuePMs(issue)
                || getIssuePIs(issue)
                || isAdmin
                || isViewer)

      !userHasAccess
    }
}

