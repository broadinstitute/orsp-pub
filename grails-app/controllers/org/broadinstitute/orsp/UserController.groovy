package org.broadinstitute.orsp

import grails.converters.JSON
import org.broadinstitute.orsp.utils.UtilityClass
import org.broadinstitute.orsp.webservice.PaginationParams
import grails.rest.Resource
import groovy.util.logging.Slf4j

import java.sql.SQLException

/**
 * Rest-based class to handle synchronizing users from Broad's BQ instance to Compliance database.
 * TODO: Should be admin linked and auth-ed at some point.
 * TODO: Could use a UI to choose users to import.
 *
 * See {@link BQService#findMissingUsers} for preference to use Broad APIs.
 */
@Slf4j
@Resource(readOnly = false, formats = ['JSON'])
class UserController extends AuthenticatedController {

    UserService userService
    BQService BQService
    QueryService queryService

    def index() {
        render BQService.findMissingUsers() as JSON
    }

    def sync() {
        List<User> syncedUsers = BQService.findMissingUsers().collect {
            userService.findOrCreateUser(
                    it.userName,
                    it.email,
                    it.displayName
            )
        }
        render syncedUsers as JSON
    }

    def getOrspUsers() {
        UtilityClass.registerUserRolesMarshaller()

        PaginationParams pagination = new PaginationParams(
                draw: params.getInt("draw") ?: 1,
                start: params.getInt("start")?: 0,
                length: params.getInt("length")?: 10,
                orderColumn: params.getInt("orderColumn")? params.getInt("orderColumn"): 0,
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
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: e.message] as JSON)
        } catch(SQLException e) {
            response.status = 500
            log.error("Error trying to execute delete/insert for new roles: ${rolesToAssign} to userId: ${userId}. " + e.message)
            render([error: "An error has ocurred trying to update roles"] as JSON)
        } catch(Exception e) {
            log.error("Error while trying to modify roles to userId: ${userId}. " + e.message)
            response.status = 500
            render([error: e.message] as JSON)
        }
    }
}
