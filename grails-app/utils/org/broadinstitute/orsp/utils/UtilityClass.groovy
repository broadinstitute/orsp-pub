package org.broadinstitute.orsp.utils

import grails.converters.JSON
import groovy.json.JsonSlurper
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.User

class UtilityClass {

    public static final String ISSUE_RENDERER_CONFIG = 'issue'
    public static final String ISSUE_COMPLETE = 'completeIssue'

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

    /**
     * Register Issue's object JSON mapping for Review Category Report
     */
    static void registerIssueMarshaller() {
        JSON.createNamedConfig(ISSUE_RENDERER_CONFIG) {
            it.registerObjectMarshaller( Issue ) { Issue issue ->
                String reviewCategory = issue.getReviewCategory()
                if (StringUtils.isNotEmpty(issue.getInitialReviewType())) {
                    def jsonSlurper = new JsonSlurper()
                    Map<String, String> initialReview = jsonSlurper.parseText(issue.getInitialReviewType()) as Map
                    reviewCategory = initialReview.size() > 0 && initialReview.containsKey('value') ? initialReview.get('value') : reviewCategory
                }
                return [
                        projectKey: issue.projectKey,
                        summary: issue.summary,
                        status:  issue.approvalStatus == IssueStatus.Legacy.name ? issue.status : issue.approvalStatus,
                        reviewCategory: StringUtils.isNotEmpty(reviewCategory) ? reviewCategory : ''
                ]
            }
        }
    }

    /**
     * Register Issue's JSON mapping to return its transient properties
    */
    static void registerCompleteIssueMarshaller() {
        JSON.createNamedConfig(ISSUE_COMPLETE) {
            it.registerObjectMarshaller( Issue ) { Issue issue ->
                return [
                        id: issue.id,
                        projectKey: issue.projectKey,
                        type: issue.type,
                        status: issue.approvalStatus == IssueStatus.Legacy.name ? issue.status : issue.approvalStatus,
                        summary: issue.summary,
                        description:issue.description,
                        reporter:issue.reporter,
                        approvalStatus:issue.approvalStatus,
                        requestDate:issue.requestDate,
                        updateDate:issue.updateDate,
                        expirationDate:issue.expirationDate,
                        attachments: issue.attachments,
                        extraProperties: issue.extraPropertiesMap,
                        fundings: issue.fundings,
                        title: issue.summary
                ]
            }
        }
    }
}
