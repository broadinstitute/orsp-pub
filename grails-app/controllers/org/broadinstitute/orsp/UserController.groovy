package org.broadinstitute.orsp

import grails.converters.JSON

/**
 * Rest-based class to handle synchronizing users from Broad's Crowd instance to Compliance database.
 * TODO: Should be admin linked and auth-ed at some point.
 * TODO: Could use a UI to choose users to import.
 *
 * See {@link CrowdService#findMissingUsers} for preference to use Broad APIs.
 */
class UserController {

    UserService userService
    CrowdService crowdService
    QueryService queryService

    def index() {
        render crowdService.findMissingUsers() as JSON
    }

    def sync() {
        List<User> syncedUsers = crowdService.findMissingUsers().collect {
            userService.findOrCreateUser(
                    it.userName,
                    it.email,
                    it.displayName
            )
        }
        render syncedUsers as JSON
    }

    def rolesManagement() {
        render(view: "/rolesManagement/index")
    }

    def getOrspUsers() {
        List<LinkedHashMap<String, User>> users = queryService.getUsers()
        render users as JSON
    }

}
