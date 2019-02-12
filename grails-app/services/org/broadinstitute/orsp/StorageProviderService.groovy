package org.broadinstitute.orsp

import com.google.api.client.googleapis.auth.oauth2.GoogleCredential
import com.google.api.client.http.GenericUrl
import com.google.api.client.http.HttpContent
import com.google.api.client.http.HttpRequest
import com.google.api.client.http.HttpRequestFactory
import com.google.api.client.http.HttpResponse
import com.google.api.client.http.HttpStatusCodes
import com.google.api.client.http.HttpTransport
import com.google.api.client.http.InputStreamContent
import com.google.api.client.http.javanet.NetHttpTransport
import com.google.api.services.storage.StorageScopes
import groovy.util.logging.Slf4j
import org.apache.commons.io.IOUtils
import org.apache.tomcat.util.http.fileupload.disk.DiskFileItem
import org.broadinstitute.orsp.config.StorageConfiguration
import org.grails.io.support.GrailsResourceUtils
import org.springframework.web.multipart.MultipartFile

import java.nio.charset.Charset
import java.security.GeneralSecurityException
import java.text.SimpleDateFormat

/**
 * TODO: Move all transactions to persistence service
 */
@Slf4j
class StorageProviderService implements Status {

    PersistenceService persistenceService
    StorageConfiguration storageConfiguration
    QueryService queryService

    private final String RESPONSE_PROJECT_HEADER = "x-goog-meta-project"
    private final String RESPONSE_UUID_HEADER = "x-goog-meta-uuid"
    private final String RESPONSE_FILE_HEADER = "x-goog-meta-file-name"
    private final String RESPONSE_TYPE_HEADER = "x-goog-meta-file-type"
    private final String RESPONSE_CREATOR_HEADER = "x-goog-meta-creator"
    private final String RESPONSE_USERNAME_HEADER = "x-goog-meta-username"
    private final String RESPONSE_CREATED_HEADER = "x-goog-meta-creation-date"

    private final static HttpTransport HTTP_TRANSPORT = new NetHttpTransport()

    private GoogleCredential credential

    private final lock = new Object()

    void removeStorageDocument(StorageDocument document, String displayUser) {
        HttpRequest request
        HttpResponse response
        try {
            persistenceService.saveEvent(document.projectKey, displayUser, "Deleting document " + document.fileName + " from storage.", null)
            request = buildHttpDeleteRequest(getUrlForDocument(document)).setThrowExceptionOnExecuteError(false)
            response = request.execute()
            int status = response.getStatusCode()
            if ((status >= 200 && status < 300)) {
                log.info("Deleting Storage Document: " + document)
                document.delete(flush: true)
            } else if (status == 404) {
                log.warn("Storage Document Not Found (but still removing it from project): " + response.getStatusMessage())
                document.delete(flush: true)
            } else {
                throw new Exception(response.getStatusMessage())
            }
        } catch (Exception e) {
            log.error("Unable to remove remote storage document with UUID: " + document.uuid + ". Error Message: " + e.getMessage())
        } finally {
            if (response != null) {
                try {
                    response.disconnect()
                } catch (IOException e) {
                    log.error("Error disconnecting response.", e)
                }
            }
        }
    }

    SubsystemStatus getStatus() {
        HttpRequest request
        HttpResponse response
        SubsystemStatus status = new SubsystemStatus()
        try {
            request = buildHttpHeadRequest(new GenericUrl(getBucketUrl()))
            response = request.execute()
            if (response.getStatusCode() == 200) {
                status.ok = true
            } else {
                status.ok = false
                status.messages = ["Error accessing Google Cloud Storage: ${response.statusCode}"]
            }
        } catch (Exception e) {
            log.error("Exception getting Google Bucket Status: ${e.getMessage()}")
            status.ok = false
            status.messages = ["Unable to access Google Cloud Storage"]
        } finally {
            if (null != response) {
                try {
                    response.disconnect()
                } catch (IOException e) {
                    log.error("Error disconnecting response.", e)
                }
            }
        }
        status
    }

    /**
     * Find file data from cloud storage.
     *
     * @param document The StorageDocument
     * @return A populated StorageDocument with file content as an InputStream
     */
    StorageDocument populateDocumentFileContent(StorageDocument document) {
        HttpRequest request
        HttpResponse response
        try {
            request = buildHttpGetRequest(getUrlForDocument(document))
            response = request.execute()
            document.setStatusCode(response.getStatusCode())
            document.setStatusMessage(response.getStatusMessage())
            if (response.getStatusCode() == 200) {
                document.setInputStream(IOUtils.toBufferedInputStream(response.getContent()))
            } else {
                document.setInputStream(IOUtils.toInputStream(response.getStatusMessage(), Charset.defaultCharset()))
            }
        } finally {
            if (null != response) {
                try {
                    response.disconnect()
                } catch (IOException e) {
                    log.error("Error disconnecting response.", e)
                }
            }
        }
        document
    }

    /**
     * Save a collection of uploaded files. Creates a new StorageDocument and remote cloud document for each one.
     *
     * @param displayName The creator display name
     * @param userName The creator user name
     * @param issueKey The project key
     * @param type The file category
     * @param files The multipart files
     * @return
     */
    def saveMultipartFiles(String displayName, String userName, String issueKey, String type, Collection<MultipartFile> files) {
        files.each {
            MultipartFile file ->
                saveMultipartFile(displayName, userName, issueKey, type, file)
        }
    }

    /**
     * Save a single uploaded file. Returns the StorageDocument and remote cloud document .
     *
     * @param displayName The creator display name
     * @param userName The creator user name
     * @param issueKey The project key
     * @param type The file category
     * @param files The multipart files
     * @return
     */
    StorageDocument saveMultipartFile(String displayName, String userName, String issueKey, String type, MultipartFile file) {
        StorageDocument document = new StorageDocument(
                projectKey: issueKey,
                fileName: file.originalFilename,
                fileType: type,
                mimeType: file.contentType,
                uuid: UUID.randomUUID().toString(),
                creator: displayName,
                username: userName,
                creationDate: new SimpleDateFormat().format(new Date())
        )
        if (saveStorageDocument(document, file.getInputStream())) {
            persistenceService.saveEvent(
                    document.projectKey,
                    document.creator,
                    "Adding document " + document.fileName + " to project",
                    null
            )
        }
        document
    }

    /**
     * Save a single uploaded file. Returns the StorageDocument and remote cloud document .
     *
     * @param displayName The creator display name
     * @param userName The creator user name
     * @param issueKey The project key
     * @param type The file category
     * @param files The multipart files
     * @return
     */
    StorageDocument saveFileItem(String displayName, String userName, String issueKey, String type, DiskFileItem file) {
        StorageDocument document = new StorageDocument(
                projectKey: issueKey,
                fileName: file.name,
                fileType: type,
                mimeType: file.contentType,
                uuid: UUID.randomUUID().toString(),
                creator: displayName,
                username: userName,
                creationDate: new SimpleDateFormat().format(new Date())
        )
        if (saveStorageDocument(document, file.getInputStream())) {
            persistenceService.saveEvent(
                    document.projectKey,
                    document.creator,
                    "Adding document " + document.fileName + " to project",
                    null
            )
        }
        document
    }

    /**
     * Save a storage document. Uploads the file content and creates a meta data entry for this document.
     *
     * @param document The StorageDocument
     * @param stream The File content as an InputStream
     * @return True if the file content is saved, false otherwise
     */
    def saveStorageDocument(StorageDocument document, InputStream stream) {
        if (!document.fileName) {
            throw new IllegalArgumentException("File name is required")
        }
        if (!document.uuid) {
            throw new IllegalArgumentException("UUID is required")
        }
        if (!document.fileType) {
            throw new IllegalArgumentException("File Type is required")
        }
        if (!document.mimeType) {
            throw new IllegalArgumentException("Mime Type is required")
        }
        if (!document.projectKey) {
            throw new IllegalArgumentException("Project Key is required")
        }
        if (!document.creator) {
            throw new IllegalArgumentException("Creator is required")
        }
        if (!document.username) {
            throw new IllegalArgumentException("Username is required")
        }
        if (!document.creationDate) {
            throw new IllegalArgumentException("Creation Date is required")
        }

        HttpContent content = new InputStreamContent(document.mimeType, stream)
        HttpResponse response = uploadContent(content, document)
        if (response.getStatusCode() == HttpStatusCodes.STATUS_CODE_OK) {
            synchronized (lock) {
                Long version = queryService.findLastVersionByFileTypeAndProjectKey(document.projectKey, document.fileType)
                version = version == null ? 0 : ++version
                document.setDocVersion(version)
                document.save(flush: true)
            }
        } else {
            throw new Exception("Unable to save Storage Document: " + response.getStatusMessage())
        }
        response.getStatusCode() == HttpStatusCodes.STATUS_CODE_OK


    }

    /**
     * Upload the file contents for a StorageDocument
     *
     * @param content The HttpContent
     * @param document The StorageDocument
     * @return The HttpResponse
     */
    HttpResponse uploadContent(HttpContent content, StorageDocument document) {
        HttpRequest request
        HttpResponse response = null
        try {
            request = buildHttpPutRequest(getUrlForKey(document.projectKey + "/" + document.uuid), content)
            request.getHeaders().put(RESPONSE_PROJECT_HEADER, document.projectKey)
            request.getHeaders().put(RESPONSE_UUID_HEADER, document.uuid)
            request.getHeaders().put(RESPONSE_FILE_HEADER, document.fileName)
            request.getHeaders().put(RESPONSE_TYPE_HEADER, document.fileType)
            request.getHeaders().put(RESPONSE_CREATOR_HEADER, document.creator)
            request.getHeaders().put(RESPONSE_USERNAME_HEADER, document.username)
            request.getHeaders().put(RESPONSE_CREATED_HEADER, document.creationDate)
            response = request.execute()
            if (response.getStatusCode() != 200) {
                log.error("Error storing contents: " + response.getStatusMessage())
            }
        } finally {
            if (null != response) {
                try {
                    response.disconnect()
                } catch (IOException e) {
                    log.error("Error disconnecting response.", e)
                }
            }
        }
        // Need to pause between upload connections - can get an errors otherwise
        try {
            Thread.sleep(1000)
        } catch (InterruptedException e) {
            System.out.println("Failed: " + e)
            log.error("Error sleeping")
        }
        response
    }

    private GenericUrl getUrlForDocument(StorageDocument document) {
        new GenericUrl(getBucketUrl() + document.projectKey + "/" + document.uuid)
    }

    private GenericUrl getUrlForKey(String key) {
        new GenericUrl(getBucketUrl() + key)
    }

    private String getBucketUrl() {
        storageConfiguration.url + storageConfiguration.bucket
    }

    private HttpRequest buildHttpDeleteRequest(GenericUrl url) throws IOException, GeneralSecurityException {
        HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(getCredential())
        requestFactory.buildDeleteRequest(url)
    }

    /**
     * Create a GET request
     *
     * @param url The URL
     * @return The HttpRequest
     */
    private HttpRequest buildHttpGetRequest(GenericUrl url) throws IOException, GeneralSecurityException {
        HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(getCredential())
        requestFactory.buildGetRequest(url)
    }

    /**
     * Create a HEAD request
     *
     * @param url The URL
     * @return The HttpRequest
     */
    private HttpRequest buildHttpHeadRequest(GenericUrl url) throws IOException, GeneralSecurityException {
        HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(getCredential())
        requestFactory.buildHeadRequest(url)
    }

    /**
     * Create a PUT request
     *
     * @param url The URL
     * @param content The content to PUT
     * @return The HttpRequest
     */
    private HttpRequest buildHttpPutRequest(GenericUrl url, HttpContent content) {
        HttpRequestFactory requestFactory = HTTP_TRANSPORT.createRequestFactory(getCredential())
        requestFactory.buildPutRequest(url, content)
    }

    /**
     *
     * @return A GoogleCredential from json secrets.
     */
    private GoogleCredential getCredential() {
        if (!credential) {
            File configFile = GrailsResourceUtils.getFile(
                    GrailsResourceUtils.toURI(this.getClass().getResource(storageConfiguration.config)),
                    "GCS Config")
            setCredential(GoogleCredential.
                    fromStream(new FileInputStream(configFile)).
                    createScoped(Collections.singletonList(StorageScopes.DEVSTORAGE_FULL_CONTROL)))
        }
        credential
    }

    void setCredential(GoogleCredential credential) {
        this.credential = credential
    }

}
