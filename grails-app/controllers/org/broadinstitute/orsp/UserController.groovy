package org.broadinstitute.orsp

import grails.converters.JSON
import org.broadinstitute.orsp.webservice.PaginationParams
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
            output['roles'] = it.roles.collect{r -> r.getRole()}
            return output
        }

        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start")?: 0,
                length: params.getInt("length")?: 10,
                orderColumn: params.getInt("orderColumn")? params.get("orderColumn"): 0,
                sortDirection: params.get("sortDirection")? params.get("sortDirection").toString() : "asc",
                searchValue: params.get("searchValue")? params.get("searchValue").toString() : null)
        render(queryService.queryUserRoles(pagination) as JSON)
    }

    def editOrspUserRole() {
        Integer userId = request.JSON["userId"] as Integer
        ArrayList<String> rolesToAssign = request.JSON["roles"] as ArrayList<String>

        try {
            userService.editUserRoles(userId, rolesToAssign)
            response.status = 200
            render([message: 'Role Updated'] as JSON)
        }
        catch(IllegalArgumentException e) {
            response.status = 400
            render([error: e.message] as JSON)
        }
        catch(Throwable e) {
            log.error("Error while trying to modify roles to userId: ${userId}." + e.message)
            response.status = 500
            render([error: e.message] as JSON)
        }
    }
}
