package org.broadinstitute.orsp

import com.github.tomakehurst.wiremock.junit.WireMockRule
import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.http.ByteArrayContent
import com.google.api.client.http.HttpContent
import com.google.api.client.http.HttpResponse
import com.google.api.client.http.HttpStatusCodes
import grails.testing.services.ServiceUnitTest
import groovy.util.logging.Slf4j
import org.apache.commons.io.IOUtils
import org.broadinstitute.orsp.config.StorageConfiguration
import org.junit.Rule
import org.mockito.Mockito
import spock.lang.Specification

import java.nio.charset.Charset
import java.text.SimpleDateFormat

import static com.github.tomakehurst.wiremock.client.WireMock.aResponse
import static com.github.tomakehurst.wiremock.client.WireMock.get
import static com.github.tomakehurst.wiremock.client.WireMock.put
import static com.github.tomakehurst.wiremock.client.WireMock.stubFor
import static com.github.tomakehurst.wiremock.client.WireMock.urlEqualTo
import static com.github.tomakehurst.wiremock.core.WireMockConfiguration.wireMockConfig

@Slf4j
class StorageProviderServiceSpec extends Specification implements ServiceUnitTest<StorageProviderService> {

    Closure doWithSpring() {{ ->
        storageConfiguration(StorageConfiguration)
    }}

    private final String uuid = UUID.randomUUID().toString()
    private final String fileContent = "Testing"
    private final HttpContent content = new ByteArrayContent("text/plain", fileContent.getBytes())
    
    @Rule
    public WireMockRule wireMockRule = new WireMockRule(wireMockConfig().dynamicPort())

    void stubStorage() {
        service.storageConfiguration.url = "http://localhost:${wireMockRule.port()}/"
        service.setCredential(Mockito.mock(GoogleCredential.class))
        wireMockRule.resetAll()
        stubFor(put(urlEqualTo("/broad_institute_orsp_test/OD-1/" + uuid))
                .willReturn(aResponse()
                .withStatus(200)
                .withBody()))
        stubFor(get(urlEqualTo("/broad_institute_orsp_test/OD-1/" + uuid))
                .willReturn(aResponse()
                .withStatus(200)
                .withBody(fileContent.getBytes())))
    }

    void "Upload Storage Document"() {
        given:
        stubStorage()
        def document = new StorageDocument(
                projectKey: "OD-1",
                fileName: "temp file.txt",
                fileType: "Other",
                mimeType: "text/plain",
                uuid: uuid,
                creator: "Test User",
                username: "testUser",
                creationDate: new Date())

        when:
        HttpResponse response = service.uploadContent(content, document)

        then:
        response.getStatusCode() == HttpStatusCodes.STATUS_CODE_OK
    }

    void "Download Storage Document"() {
        given:
        stubStorage()
        def document = new StorageDocument(
                projectKey: "OD-1",
                fileName: "temp file.txt",
                fileType: "Other",
                mimeType: "text/plain",
                uuid: uuid,
                creator: "Test User",
                username: "testUser",
                creationDate: new Date())

        when:
        StorageDocument newDoc = service.populateDocumentFileContent(document)

        then:
        newDoc.inputStream != null
        IOUtils.toString(newDoc.inputStream, Charset.defaultCharset()).equals(fileContent)
    }

}
