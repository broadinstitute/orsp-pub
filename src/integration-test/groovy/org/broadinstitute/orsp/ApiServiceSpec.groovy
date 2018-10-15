package org.broadinstitute.orsp

import grails.testing.mixin.integration.Integration
import grails.transaction.Rollback
import grails.util.GrailsWebMockUtil
import grails.web.servlet.mvc.GrailsParameterMap
import org.broadinstitute.orsp.webservice.ApiService
import org.springframework.beans.factory.annotation.Autowired
import org.springframework.web.context.WebApplicationContext
import org.springframework.web.context.request.RequestContextHolder
import spock.lang.Specification

@Integration
@Rollback
class ApiServiceSpec extends Specification {

    @Autowired
    ApiService apiService

    @Autowired
    IssueService issueService

    @Autowired
    WebApplicationContext ctx

    void setup() {
        GrailsWebMockUtil.bindMockWebRequest(ctx)
    }

    void cleanup() {
        RequestContextHolder.resetRequestAttributes()
    }

    private Issue issue
    private Issue consent
    private ConsentCollectionLink link
    private DataUseRestriction restriction

    // Mock data
    void mockData() {
        issue = new Issue(
                type: IssueType.IRB.name,
                status: IssueStatus.Approved,
                summary: "IRB",
                description: "IRB",
                reporter: "Test User",
                requestDate: new Date())
        Map propMap = new HashMap()
        propMap.put(IssueExtraProperty.ACCURATE, "10057")
        GrailsParameterMap params = new GrailsParameterMap(propMap, null)
        issue = issueService.addIssue(issue, params)

        consent = new Issue(
                type: IssueType.CONSENT_GROUP.name,
                status: IssueStatus.Open,
                summary: "Consent",
                description: "Consent",
                reporter: "Test User",
                requestDate: new Date())
        GrailsParameterMap consentParams = new GrailsParameterMap(new HashMap(), null)
        consent = issueService.addIssue(consent, consentParams)

        link = new ConsentCollectionLink(
                projectKey: issue.projectKey,
                consentKey: consent.projectKey,
                sampleCollectionId: "SC-00000",
                creationDate: new Date()).save(flush: true)

        restriction = new DataUseRestriction(consent: consent, generalUse: true).save(flush: true)
    }

    void "Test Project Summaries"() {
        given:
        mockData()
        def summaries = apiService.getProjectSummaries(null)

        expect:
        !summaries.isEmpty()
        summaries.size() == 2
    }

    void "Test Sample Collection Summaries"() {
        given:
        mockData()
        def summaries = apiService.getSampleSummaries()

        expect:
        !summaries.isEmpty()
        summaries.size() == 1
    }

    void "Test Consent Summaries"() {
        given:
        mockData()
        def summaries = apiService.getConsents()

        expect:
        !summaries.isEmpty()
        summaries.size() == 1
    }

    void "Test Bookit Summaries"() {
        given:
        mockData()
        def summaries = apiService.getBookitSummaries()

        expect:
        !summaries.isEmpty()
        summaries.size() == 1
    }

}
