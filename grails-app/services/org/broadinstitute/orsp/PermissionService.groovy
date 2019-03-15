package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Transactional
@Slf4j
class PermissionService implements UserInfo {

    UserService userService

    // get issue's collaborators as a List<String>
    List<String> getIssueCollaborators(Issue issue) {
        def collaborators = issue.extraProperties.findAll ({ it.name == 'collaborator' }).collect { property -> property.value }
List<String> getIssueCollaborators(issue) {
        issue.extraProperties.findAll ({ it.name == 'collaborator' }).collect { property -> property.value }
}
    }

    // get issue's pms as a List<String>
    def getIssuePMs(issue) {
        def pms = issue.extraProperties.findAll ({ it.name == 'pm' }).collect { property -> property.value }
        pms
    }

    // get issue's pis as a List<String>
    def getIssuePIs(issue) {
        def pis = issue.extraProperties.findAll ({ it.name == 'pi' }).collect { property -> property.value }
        pis
    }

    // get issue's actors as a List<String>
    def getIssueActors(issue) {
        def actors = issue.extraProperties.findAll ({ it.name == 'actor' }).collect { property -> property.value }
        actors
    }

    // verifies if logged user belongs to some user list ....
    def issueIsForbidden(issue, userName, isAdmin, isReadOnlyAdmin) {

        if (issue.reporter == userName
                || getIssueCollaborators(issue).indexOf(userName) >= 0
                || getIssuePMs(issue).indexOf(userName) >= 0
                || getIssuePIs(issue).indexOf(userName) >= 0
                || isAdmin
                || isReadOnlyAdmin) {
            return false
        }
        true
    }
}

