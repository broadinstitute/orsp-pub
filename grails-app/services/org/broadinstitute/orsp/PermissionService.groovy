package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    List<String> getIssueCollaborators(Issue issue) {
      issue.extraProperties.findAll ({ it.name == IssueExtraProperty.COLLABORATOR }).collect { property -> property.value }
    }

    // get issue's pms as a List<String>
    List<String> getIssuePMs(Issue issue) {
      issue.extraProperties.findAll ({ IssueExtraProperty.PM }).collect { property -> property.value }
    }

    // get issue's pis as a List<String>
    List<String> getIssuePIs(Issue issue) {
      issue.extraProperties.findAll ({ IssueExtraProperty.PI }).collect { property -> property.value }
    }

    // verifies if logged user belongs to some user list ....
    def issueIsForbidden(issue, userName, isAdmin, isReadOnlyAdmin) {

        boolean userHasAcess = (issue.reporter == userName
                || getIssueCollaborators(issue).indexOf(userName) >= 0
                || getIssuePMs(issue).indexOf(userName) >= 0
                || getIssuePIs(issue).indexOf(userName) >= 0
                || isAdmin
                || isReadOnlyAdmin)

      !userHasAcess
    }
}

