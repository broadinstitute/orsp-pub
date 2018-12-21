package org.broadinstitute.orsp.api

import com.google.gson.Gson
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.ConsentCollectionLink
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueStatus
import org.broadinstitute.orsp.IssueType
import org.broadinstitute.orsp.models.ConsentGroup

class ConsentGroupController extends AuthenticatedController {

    def show() {
        render(view: "/newConsentGroup/index")
    }

    def create() {
        Issue source = queryService.findByKey(params.source)
        Gson gson = new Gson()
        ConsentGroup consentGroup = gson.fromJson(gson.toJson(request.JSON), ConsentGroup.class)
        Issue consent = issueService.createIssue(IssueType.CONSENT_GROUP, consentGroup.getIssue(IssueType.CONSENT_GROUP.name, getUser()?.userName))

        consent = issueService.addIssue(consentGroup.getIssue(IssueType.CONSENT_GROUP.name, getUser()?.userName), params)
        //TODO
        try {
            // If any sample collections were linked, we need to add them to the consent group.
            def sampleCollectionIds = []
            if (params.newSamples) { sampleCollectionIds.addAll(params.newSamples) }
            if (sampleCollectionIds.isEmpty()) {
                new ConsentCollectionLink(
                        projectKey: source.projectKey,
                        consentKey: consent.projectKey,
                        sampleCollectionId: null,
                        creationDate: new Date()
                ).save(flush: true)
            } else {
                sampleCollectionIds.each {
                    new ConsentCollectionLink(
                            projectKey: source.projectKey,
                            consentKey: consent.projectKey,
                            sampleCollectionId: it,
                            creationDate: new Date()
                    ).save(flush: true)
                }
            }
        } catch (Exception e) {
            flash.error = e.getMessage()
        }
        redirect([controller: source.controller, action: "show", params: [id: source.projectKey, tab: "consent-groups"]])
    }
}

