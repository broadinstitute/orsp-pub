package org.broadinstitute.orsp.utils

import grails.converters.JSON
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.User

class UtilityClass {

    /**
     * Register Comment's object JSON mapping for Project's and Sample Data Cohort's Comments
     */
    static void registerCommentMarshaller() {
        JSON.registerObjectMarshaller(Comment) {
            LinkedHashMap output = [:]
            output['id'] = it.id
            output['author'] = it.author
            output['comment'] = it.description
            output['date'] = it.created
            return output
        }
    }

    /**
     * Register User's object JSON mapping for Roles Management
     */
    static void registerUserRolesMarshaller() {
        JSON.registerObjectMarshaller(User) {
            LinkedHashMap output = [:]
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
    }
}
