package org.broadinstitute.orsp

import grails.gorm.transactions.Transactional
import groovy.util.logging.Slf4j

@Slf4j
class UserService {
    QueryService queryService

    private static String BROAD = "@broadinstitute.org"

    /**
     * Find all userNames.
     *
     * @return All userNames for all users in the system
     */
    @Transactional(readOnly = true)
    Collection<String> findAllUserNames() {
        User.findAll()*.userName
    }

    /**
     * Default auth/login method. Look up in our (non-system-of-record) table of users
     * to find out if the current login user exists. Create a new one if the user has a
     * Broad email address and return the found/created user.
     *
     * There can be multiple accounts with the same email address (role accounts, etc.)
     * From the perspective of logging in via google, we have to look at the one that
     * logs in vs any other kind of user record.
     *
     * @param userName      The user's userName
     * @param emailAddress  The user's email address
     * @param displayName   The user's display name
     * @return User
     */
    @Transactional
    User findOrCreateAuthenticatedUser(String userName, String emailAddress, String displayName) {
        def results = User.withSession {
            User.withCriteria {
                eq "emailAddress", emailAddress
                order("lastLoginDate", "desc")
            }
        }
        if (results.size() > 0) {
            User user = results.get(0)
            user.setLastLoginDate(new Date())
            user.save(flush: true)
            return user
        }
        if (emailAddress.contains(BROAD)) {
            return new User(
                    userName: userName,
                    emailAddress: emailAddress,
                    displayName: displayName,
                    createdDate: new Date(),
                    updatedDate: new Date(),
                    lastLoginDate: new Date()
            ).save(flush: true)
        }
        null
    }

    /**
     * Find user by username.
     *
     * @param userName The user's username
     * @return The first user that matches the query
     */
    @Transactional(readOnly = true)
    User findUser(String userName) {
        // Strip out email addresses from userNames.
        if (userName?.toLowerCase()?.contains(BROAD)) {
            userName = userName.toLowerCase() - BROAD
        }
        def results = User.findAllByUserName(userName)
        if (results.size() > 0) {
            results.get(0)
        } else {
            null
        }
    }

    /**
     * Find users by usernames.
     *
     * @param userNames The userNames to search for
     * @return All users that match the userNames
     */
    @Transactional(readOnly = true)
    Collection<User> findUsers(Collection<String> userNames) {
        if (userNames == null || userNames?.isEmpty()) {
            Collections.<User>emptyList()
        } else {
            User.findAllByUserNameInList(userNames.asList())
        }
    }

    /**
     * Search users by partial name match.
     *
     * @param term The search term
     * @return List of users that match term
     */
    @Transactional(readOnly = true)
    List<User> findUsersBySearchTerm(String term) {
        def likeTerm = generateILikeTerm(term)
        def results = User.withCriteria {
            or {
                ilike "userName", likeTerm
                ilike "emailAddress", likeTerm
                ilike "displayName", likeTerm
            }
            order("displayName", "asc")
        }
        (List<User>) results
    }

    private static String generateILikeTerm(String term) {
        ("%" + term + "%").toLowerCase()
    }

    /**
     * New User create method. Looks for the current user information and will create a new one
     * if it doesn't already exist.
     *
     * @param userName      The user's userName
     * @param emailAddress  The user's email address
     * @param displayName   The user's display name
     * @return User
     */
    @Transactional
    User findOrCreateUser(String userName, String emailAddress, String displayName) {
        def results = User.withSession {
            User.withCriteria {
                eq "emailAddress", emailAddress
                order("lastLoginDate", "desc")
            }
        }
        if (results.size() > 0) {
            return results.get(0)
        }
        if (emailAddress.contains(BROAD)) {
            return new User(
                    userName: userName,
                    emailAddress: emailAddress,
                    displayName: displayName,
                    createdDate: new Date(),
                    updatedDate: new Date()
            ).save(flush: true)
        } else {
            null
        }
    }

    /**
     * Edits a user's roles
     *
     * @param userId        The user's id
     * @param rolesToAssign Roles String array to be assigned
     */
    void editUserRoles (Integer userId, ArrayList<String> rolesToAssign) {
        if (userId != null) {
            User user = User.findById(userId)
            if (user != null && validateRoles(rolesToAssign)) {
                queryService.deleteOrspUserRoles(userId)
                if (!rolesToAssign.isEmpty()) {
                    queryService.updateOrspUserRoles(user, rolesToAssign)
                }
            } else {
                log.error("Error while trying to modify roles to userId: ${userId}.")
                throw IllegalArgumentException()
            }
        } else {
            log.error("Error while trying to modify roles to userId null.")
            throw IllegalArgumentException()
        }
    }

    /**
     * Receives roles intended to be assigned to a user
     * Rules are:
     * 1) RolesToAssign must be a valid role, defined in SupplementalRoles
     * 2) READ_ONLY cannot coexist with ADMIN, ORSP or Compliance Office roles
     *
     * @param rolesToAssign     Roles String array to be assigned
     * @return Boolean          If roles can be assigned
     */
    static Boolean validateRoles(ArrayList<String> rolesToAssign) {
        ArrayList<String> validRoles = SupplementalRole.getAssignableRolesArray()
        Boolean allRolesAreValid = rolesToAssign.stream().allMatch{e -> validRoles.contains(e)}

        Boolean readOnlyCoexists = !(rolesToAssign.contains(SupplementalRole.READ_ONLY_ADMIN) &&
                (rolesToAssign.contains(SupplementalRole.ORSP) ||
                        rolesToAssign.contains(SupplementalRole.COMPLIANCE_OFFICE) ||
                        rolesToAssign.contains(SupplementalRole.ADMIN)))

        allRolesAreValid && readOnlyCoexists
    }
}
