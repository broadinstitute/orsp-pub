package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

UserService userService

// get issue's collaborators as a List<String>
List<String> getIssueCollaborators(Map<String, List<String>> extraProperties) {
List<String> collaborators = extraProperties.findAll({ [IssueExtraProperty.COLLABORATOR, IssueExtraProperty.COLLABORATORS].contains(it.key) })
.values().flatten().collect({ it -> it.toString() })
collaborators
}

// get issue's pms as a List<String>
List<String> getIssuePMs(Map<String, List<String>> extraProperties) {
List<String> pms = extraProperties.findAll ({ it.key == IssueExtraProperty.PM })
.values().flatten().collect({ it -> it.toString() })
pms
}

// get issue's pis as a List<String>
List<String> getIssuePIs(Map<String, List<String>> extraProperties) {
List<String> pis = extraProperties.findAll ({ it.key == IssueExtraProperty.PI })
.values().flatten().collect({ it -> it.toString() })
pis
}

// verifies if logged user belongs to some user list ....
Boolean issueIsForbidden(Issue issue, String userName, boolean isAdmin, boolean isViewer) {
Map<String, List<String>> extraProperties = issue.extraPropertiesMap
userHasIssueAccess(issue.reporter, extraProperties, userName, isAdmin, isViewer)
}

Boolean issueIsForbidden(IssueSearchItemDTO issue, String userName, boolean isAdmin, boolean isViewer) {
Map<String, List<String>> extraProperties = issue.extraProperties
userHasIssueAccess(issue.reporter, extraProperties, userName, isAdmin, isViewer)
}

Boolean userHasIssueAccess(String reporter, Map<String, List<String>> extraProperties, String userName, boolean isAdmin, boolean isViewer) {
boolean userHasAccess = (reporter == userName
|| getIssueCollaborators(extraProperties)?.contains(userName)
|| getIssuePMs(extraProperties).contains(userName)
|| getIssuePIs(extraProperties).contains(userName)
|| isAdmin
|| isViewer)
!userHasAccess
}
}
