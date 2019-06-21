package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    Collection<String> getIssueCollaborators(Map<String, List<String>> extraProperties) {
        Collection<String> collaborators = extraProperties.findAll({ [IssueExtraProperty.COLLABORATOR, IssueExtraProperty.COLLABORATORS].contains(it.key) }).
                values()
        collaborators
    }

    // get issue's pms as a List<String>
    Collection<String> getIssuePMs(Map<String, List<String>> extraProperties) {
        Collection<String> pms = extraProperties.findAll ({ it.key == IssueExtraProperty.PM }).values()
        pms
    }

    // get issue's pis as a List<String>
    Collection<String> getIssuePIs(Map<String, List<String>> extraProperties) {
        Collection<String> pis = extraProperties.findAll ({ it.key == IssueExtraProperty.PI }).values()
        pis
    }

    // verifies if logged user belongs to some user list ....
    def issueIsForbidden(Issue issue, String userName, boolean isAdmin, boolean isViewer) {
        Map<String, List<String>> extraProperties = issue.extraPropertiesMap
        userHasIssueAccess(issue.reporter, extraProperties, userName, isAdmin, isViewer)
    }

    def issueIsForbidden(IssueSearchItemDTO issue, String userName, boolean isAdmin, boolean isViewer) {
        Map<String, List<String>> extraProperties = issue.extraProperties
        userHasIssueAccess(issue.reporter, extraProperties, userName, isAdmin, isViewer)
    }

    def userHasIssueAccess(String reporter, Map<String, List<String>> extraProperties, String userName, boolean isAdmin, boolean isViewer) {
        boolean userHasAccess = (reporter == userName
                || getIssueCollaborators(extraProperties)?.contains(userName)
                || getIssuePMs(extraProperties).contains(userName)
                || getIssuePIs(extraProperties).contains(userName)
                || isAdmin
                || isViewer)
        !userHasAccess
    }
}

