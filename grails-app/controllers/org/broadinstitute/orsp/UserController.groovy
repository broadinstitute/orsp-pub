package org.broadinstitute.orsp

import grails.converters.JSON
import java.util.stream.Collectors
import grails.rest.Resource
import groovy.util.logging.Slf4j

/**
 * Rest-based class to handle synchronizing users from Broad's Crowd instance to Compliance database.
 * TODO: Should be admin linked and auth-ed at some point.
 * TODO: Could use a UI to choose users to import.
 *
 * See {@link CrowdService#findMissingUsers} for preference to use Broad APIs.
 */
@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class UserController extends AuthenticatedController {

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
        JSON.registerObjectMarshaller(User) {
            def output = [:]
            output['id'] = it.id
            output['userName'] = it.userName
            output['displayName'] = it.displayName
            output['emailAddress'] = it.emailAddress
            output['createdDate'] = it.createdDate
            output['updatedDate'] = it.updatedDate
            output['lastLoginDate'] = it.lastLoginDate
            output['roles'] = it.roles.stream().map{role ->
                role.getRole()}.collect(Collectors.joining(", "))
            return output
        }
        List<User> users = queryService.getUsers()
        render users as JSON
    }

    def editOrspUserRole() {
        Integer userId = request.JSON["userId"] as Integer
        if (userId != null) {
            ArrayList<String> rolesToAssign = request.JSON["roles"] as ArrayList<String>
            User user = User.findById(userId)
            try {
                queryService.deleteOrspUserRoles(userId)
                if (!rolesToAssign.isEmpty()) {
                    queryService.updateOrspUserRoles(user, rolesToAssign)
                }
                response.status = 200
                render([message: 'Role Updated'] as JSON)
            } catch(Exception e) {
                log.error("Error while trying to modify roles to userId: ${userId}." + e.message)
                response.status = 500
                render([error: e.message] as JSON)
            }
        }
    }
}
