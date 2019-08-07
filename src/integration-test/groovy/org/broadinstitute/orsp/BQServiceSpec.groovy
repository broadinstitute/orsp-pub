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
class BQServiceSpec extends Specification {

    @Autowired
    BQService BQService

    @Autowired
    UserService userService

    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    def setup() {
    }

    def cleanup() {
    }

    void stubBQResource() {
        BQService.bqConfiguration.url = "http://localhost:${wireMockRule.port()}/BQ"
        wireMockRule.resetAll()
        URL url = Resources.getResource("test_broad_users.json")
        String mockBQJson = Resources.toString(url, Charsets.UTF_8)
        stubFor(get(anyUrl()) 
                .willReturn(aResponse()
                .withStatus(200)
                .withHeader("Content-Type", "application/json")
                .withBody(mockBQJson)))
    }

    void "BQ Service finds all users in test user file"() {
        given:
        stubBQResource()

        when:
        def missingUsers = BQService.findMissingUsers()

        then: "BQ User Details Exist"
        missingUsers != null
        !missingUsers.isEmpty()
        missingUsers.size() == 10
    }

    void "BQ Service finds missing users in test user file"() {
        given:
        User user = userService.findOrCreateUser(
                "testuser1",
                "testuser1@broadinstitute.org",
                "Test User 1")
        stubBQResource()
        Collection<String> existingUserNames = userService.findAllUserNames()

        when:
        def missingUsers = BQService.findMissingUsers()

        then:"BQ User Details Exist"
        existingUserNames.size() == 1
        user != null
        missingUsers != null
        !missingUsers.isEmpty()
        missingUsers.size() < 10
    }

}
