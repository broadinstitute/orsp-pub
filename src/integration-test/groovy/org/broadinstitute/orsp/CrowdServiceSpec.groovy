package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import com.google.common.base.Charsets
import com.google.common.io.Resources
import grails.testing.mixin.integration.Integration
import org.junit.Rule
import org.springframework.beans.factory.annotation.Autowired
import spock.lang.Specification

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.anyUrl
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

@Integration
class CrowdServiceSpec extends Specification {

    @Autowired
    CrowdService crowdService

    @Autowired
    UserService userService

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    def setup() {
    }

    def cleanup() {
    }

    void stubCrowdResource() {
        crowdService.crowdConfiguration.url = "http://localhost:${wireMockRule.port()}/crowd"
        wireMockRule.resetAll()
        URL url = Resources.getResource("test_crowd_users.json")
        String mockCrowdJson = Resources.toString(url, Charsets.UTF_8)
        stubFor(get(anyUrl()) //"/crowd/rest/usermanagement/latest/search*"
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockCrowdJson)))
    }

    void "Crowd Service finds all users in test user file"() {
        given:
        stubCrowdResource()

        when:
        def missingUsers = crowdService.findMissingUsers()

        then: "Crowd User Details Exist"
        missingUsers != null
        !missingUsers.isEmpty()
        missingUsers.size() == 10
    }

    void "Crowd Service finds missing users in test user file"() {
        given:
        User user = userService.findOrCreateUser(
                "testuser1",
                "testuser1@broadinstitute.org",
                "Test User 1")
        stubCrowdResource()
        Collection<String> existingUserNames = userService.findAllUserNames()

        when:
        def missingUsers = crowdService.findMissingUsers()

        then:"Crowd User Details Exist"
        existingUserNames.size() == 1
        user != null
        missingUsers != null
        !missingUsers.isEmpty()
        missingUsers.size() < 10
    }

}
