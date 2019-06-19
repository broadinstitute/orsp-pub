package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    List<String> getIssueCollaborators(Map<String, List<String>> extraProperties) {
      extraProperties.findAll ({ it.key == IssueExtraProperty.COLLABORATOR }).collect { property -> property.value }
//        issue.extraProperties.findAll ({ it.name == IssueExtraProperty.COLLABORATOR }).collect { property -> property.value }
    }

    // get issue's pms as a List<String>
    List<String> getIssuePMs(Map<String, List<String>> extraProperties) {
      extraProperties.findAll ({ it.key == IssueExtraProperty.PM }).collect { property -> property.value }
//      issue.extraProperties.findAll ({ it.name == IssueExtraProperty.PM }).collect { property -> property.value }
    }

    // get issue's pis as a List<String>
    List<String> getIssuePIs(Map<String, List<String>> extraProperties) {
//      issue.extraProperties.findAll ({ it.name == IssueExtraProperty.PI }).collect { property -> property.value }
      extraProperties.findAll ({ it.key == IssueExtraProperty.PI }).collect{ property -> property.value }
    }

    // verifies if logged user belongs to some user list ....
    def issueIsForbidden(Issue issue, String userName, boolean isAdmin, boolean isViewer) {
        Map<String, List<String>> extraProperties = issue.extraPropertiesMap
        boolean userHasAccess = (issue.reporter == userName
                || getIssueCollaborators(extraProperties).indexOf(userName) >= 0
                || getIssuePMs(extraProperties).indexOf(userName) >= 0
                || getIssuePIs(extraProperties).indexOf(userName) >= 0
                || isAdmin
                || isViewer)

      !userHasAccess
    }

    def issueIsForbidden(IssueSearchItemDTO issue, String userName, boolean isAdmin, boolean isViewer) {
        if (
        != null) {

            Map<String, List<String>> extraProperties = issue.extraPropertiesMap
            boolean userHasAccess = (issue.reporter == userName
                    || getIssueCollaborators(extraProperties).indexOf(userName) >= 0
                    || getIssuePMs(issue).indexOf(userName) >= 0
                    || getIssuePIs(issue).indexOf(userName) >= 0
                    || isAdmin
                    || isViewer)

            !userHasAccess
        }
    }
}

