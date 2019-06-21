package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    List<String> getIssueCollaborators(Map<String, List<String>> extraProperties) {
        Collection<List<String>> collaboratorsValues = extraProperties.
                findAll({ [IssueExtraProperty.COLLABORATOR, IssueExtraProperty.COLLABORATORS].contains(it.key) }).
                values()
        List<String> results = new ArrayList<String>()
        if (collaboratorsValues.size() != 0) {
            results = collaboratorsValues.first()
        }
        results
    }

    // get issue's pms as a List<String>
    List<String> getIssuePMs(Map<String, List<String>> extraProperties) {
        Collection<List<String>> collaboratorsValues = extraProperties.findAll ({ it.key == IssueExtraProperty.PM }).values()
        List<String> results = new ArrayList<String>()
        if (collaboratorsValues.size() != 0) {
            results = collaboratorsValues.first()
        }
        results
    }

    // get issue's pis as a List<String>
    List<String> getIssuePIs(Map<String, List<String>> extraProperties) {
        Collection<List<String>> collaboratorsValues = extraProperties.findAll ({ it.key == IssueExtraProperty.PI }).values()
        List<String> results = new ArrayList<String>()
        if (collaboratorsValues.size() != 0) {
            results = collaboratorsValues.first()
        }
        results
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

