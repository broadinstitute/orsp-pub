package org.broadinstitute.orsp.utils

import grails.converters.JSON
import groovy.json.JsonSlurper
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.Comment
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.Event
import org.broadinstitute.orsp.Funding
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.QueryService
import org.broadinstitute.orsp.SampleCollection
import org.broadinstitute.orsp.StatusEventDTO
import org.broadinstitute.orsp.User

import java.text.SimpleDateFormat

import java.util.concurrent.atomic.AtomicInteger

class UtilityClass {
    QueryService queryService

    public static final String ISSUE_RENDERER_CONFIG = 'issue'
    public static final String ISSUE_FOR_QA = 'qaIssue'
    public static final String FUNDING_REPORT_RENDERER_CONFIG = 'fundingReport'
    public static final String HISTORY = 'history'
    public static final String SAMPLES = 'samples'
    public static final String CONSENT_COLLECTION = 'consentCollectionReport'

    UtilityClass(QueryService queryService) {
        this.queryService = queryService
    }
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
                        id: issue.id,
                        type: issue.type,
                        projectKey: issue.projectKey,
                        summary: issue.summary,
                        status:  issue.approvalStatus == IssueStatus.Legacy.name ? issue.status : issue.approvalStatus,
                        issueStatus: issue.status,
                        reviewCategory: StringUtils.isNotEmpty(reviewCategory) ? reviewCategory : '',
                        reporter       : issue.reporter,
                        requestDate    : issue.requestDate,
                        attachments    : issue.attachments,
                        actor          : issue.getActorUsernames()
                ]
            }
        }
    }

    static void registerQaReportIssueMarshaller() {
        JSON.createNamedConfig(ISSUE_FOR_QA) {
            it.registerObjectMarshaller( StatusEventDTO ) { StatusEventDTO statusEvent ->
                return [
                    id             : statusEvent.issue.id,
                    type           : statusEvent.issue.type,
                    projectKey     : statusEvent.issue.projectKey,
                    summary        : statusEvent.issue.summary,
                    status         : statusEvent.issue.approvalStatus == IssueStatus.Legacy.name ? statusEvent.issue.status : statusEvent.issue.approvalStatus,
                    reporter       : statusEvent.issue.reporter,
                    requestDate    : statusEvent.issue.requestDate,
                    attachments    : statusEvent.issue.attachments,
                    actor          : statusEvent.issue.getActorUsernames().sort().join(' ,'),
                    age            : statusEvent.duration,
                ]
            }
        }
    }

    void registerFundingsReportMarshaller() {
        AtomicInteger at = new AtomicInteger(0)

        JSON.createNamedConfig(FUNDING_REPORT_RENDERER_CONFIG) {
            it.registerObjectMarshaller( Funding ) { Funding funding ->
                return [
                        id: at.incrementAndGet(),
                        type: funding.issue.type,
                        projectKey: funding.issue.projectKey,
                        protocol: funding.issue.protocol,
                        summary: funding.issue.summary,
                        status: funding.issue.status,
                        source: funding.source,
                        name: funding.name,
                        awardNumber: funding.awardNumber,
                        pis: getPIsDisplayName((Issue) funding.issue)
                ]
            }
        }
    }

    static void registerEventMarshaller() {
        JSON.createNamedConfig(HISTORY) {
            SimpleDateFormat  sd = new SimpleDateFormat("yyyy-MM-dd HH:mm");
            it.registerObjectMarshaller( Event ) { Event event ->
                return [
                        id: event.id,
                        summary: event.summary,
                        author: event.author,
                        created: sd.format(event.created)
                ]
            }
        }
    }

    static void registerSampleCollectionMarshaller() {
        JSON.createNamedConfig(SAMPLES) {
            it.registerObjectMarshaller( SampleCollection ) { SampleCollection sc ->
                return [
                        id: sc.id,
                        name: sc.name
                ]
            }
        }
    }

    static void registerConsentCollectionReportMarshaller() {
        JSON.createNamedConfig(CONSENT_COLLECTION) {
            it.registerObjectMarshaller( ConsentCollectionLink ) { ConsentCollectionLink link ->
                return [
                        id: link.id,
                        projectKey: link.projectKey,
                        consentKey: link.consentKey,
                        sampleCollectionId: link.sampleCollectionId ?: '',
                        creationDate: link.creationDate,
                        sampleCollectionName: link.sampleCollection ? link.sampleCollection.name : ''
                ]
            }
        }
    }

    private List<String> getPIsDisplayName(Issue issue) {
        List<String> piUserNames = issue?.getPIs()?.unique()
        if (!piUserNames?.isEmpty()) {
            queryService.findUsersInUserNameList(piUserNames).collect { it.displayName }
        } else {
            Collections.emptyList()
        }
    }

}
