package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.apache.pdfbox.pdmodel.PDDocument
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.DataUseLetterService
import org.broadinstitute.orsp.DataUseRestriction
import org.broadinstitute.orsp.DocumentStatus
import org.broadinstitute.orsp.EventType
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueExtraProperty
import org.broadinstitute.orsp.OntologyService
import org.broadinstitute.orsp.PersistenceService
import org.broadinstitute.orsp.QueryService
import org.broadinstitute.orsp.StorageDocument
import org.broadinstitute.orsp.StorageProviderService
import org.broadinstitute.orsp.User
import org.broadinstitute.orsp.UserInfo
import org.broadinstitute.orsp.UserService
import org.broadinstitute.orsp.dataUseLetter.DataUseLetterFields
import org.broadinstitute.orsp.utils.DulPdfParser
import org.broadinstitute.orsp.utils.IssueUtils
import org.broadinstitute.orsp.webservice.OntologyTerm

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class DataUseLetterController implements ExceptionHandler, UserInfo {

    DataUseLetterService dataUseLetterService
    OntologyService ontologyService
    PersistenceService persistenceService
    StorageProviderService storageProviderService
    UserService userService
    QueryService queryService

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def create () {
        DataUseLetter inputDul = IssueUtils.getJson(DataUseLetter.class, request.JSON)
        try {
            DataUseLetter newDul = dataUseLetterService.generateDul(inputDul)
            persistenceService.saveEvent(inputDul.consentGroupKey, getUser()?.displayName, "DUL copied to clipboard", EventType.COPY_DUL_LINK_TO_CLIPBOARD)
            response.status = 200
            render([dulToken: newDul.getUid()] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def update () {
        DataUseLetter input = IssueUtils.getJson(DataUseLetter.class, request.JSON)
        try {
            DataUseLetter dul = dataUseLetterService.udpateDataUseLetter(input)
            persistenceService.saveEvent(dul.consentGroupKey, getUser()?.displayName, "DUL Added", EventType.SUBMIT_DUL)
            response.status = 200
            render(response.status)
        } catch(IllegalArgumentException e) {
            handleIllegalArgumentException(e)
        } catch(Exception e) {
            handleException(e)
        }
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def createPdf() {
        String templateName = "DataUseLetterPDF.pdf"
        String uid = request.JSON[DataUseLetterFields.UID.abbreviation]
        DataUseLetter dul = DataUseLetter.findByUid(uid)
        if (dul != null) {
            ByteArrayOutputStream output = new ByteArrayOutputStream()
            PDDocument dulDOC = new PDDocument()
            try {
                ClassLoader classLoader = getClass().getClassLoader()
                InputStream is = classLoader.getResourceAsStream(templateName)
                dulDOC = PDDocument.load(is)
                is.close()
                new DulPdfParser().fillDulForm(dul, dulDOC.getDocumentCatalog().getAcroForm())
                dulDOC.save(output)
                String fileName = JSON.parse(dul.dulInfo)[DataUseLetterFields.PROTOCOL_TITLE.abbreviation].replaceAll(' / ','_').concat("_DataUseLetter.pdf")
                uploadDataUseLetter(dul,new ByteArrayInputStream(output.toByteArray()), fileName)

                dul.setSubmitted(true)
                dul.setSubmitDate(new Date())
                dul.save(flush:true)
                dulDOC.close()
                output.close()
                response.status = 200
            } catch (Exception e) {
                handleException(e)
            } finally {
                dulDOC.close()
                output.close()
            }
        } else {
            handleNotFound('DUL not found.')
        }
    }

    @SuppressWarnings(["GroovyAssignabilityCheck"])
    void uploadDataUseLetter(DataUseLetter dul, ByteArrayInputStream dulDoc, String fileName) {
        try {
            if (dul && dulDoc.available() != 0) {
                Object dulInfo = JSON.parse(dul.dulInfo)
                StorageDocument document = new StorageDocument(
                        projectKey: dul.getConsentGroupKey(),
                        fileName: fileName,
                        fileType: 'Data Use Letter',
                        mimeType: "application/pdf",
                        uuid: dul.getUid(),
                        creator: dulInfo[DataUseLetterFields.PRINTED_NAME.abbreviation],
                        username: dul.getCreator(),
                        creationDate: new Date(),
                        status: DocumentStatus.PENDING.status
                )
                storageProviderService.saveStorageDocument(document, dulDoc)
            } else {
                throw new MissingResourceException("Unable to upload empty Data Use Letter pdf.")
            }
        } catch (Exception e) {
            handleException(e)
        }
    }

    def saveSdul() {
        try {
            DataUseRestriction restriction = dataUseLetterService.getRestrictionFromParams(request.JSON)
            dataUseLetterService.saveRestriction(restriction, getUser()?.displayName)
            response.status = 200
            render(restriction: restriction as JSON)
        } catch (IllegalArgumentException iae) {
            handleIllegalArgumentException(iae)
        } catch (Exception e) {
            handleException(e)
        }
    }

    def getDul() {
        String uid = request.parameterMap["id"]?.first()
        DataUseLetter dul = DataUseLetter.findByUid(uid)
        if(dul == null) {
            render([error: 'notFound'] as JSON)
        } else if(dul.submitted) {
            render([error: 'submitted'] as JSON)
        } else {
            render([dul: dul] as JSON)
        }
    }

    def getMatchingDiseaseOntologies() {
        String term = params.q ?: params.term
        List<OntologyTerm> matches = ontologyService.getDiseaseMatches(term)
        render(text: matches as JSON, contentType: "application/json")
    }


    def findByUUID() {
        String uid = params.uuid
        DataUseLetter dul = DataUseLetter.findByUid(uid)
        Map<String, String> consent = new HashMap<>()
        if(dul != null) {
            User user = userService.findUser(dul.getCreator())
            Issue issue = queryService.findByKey(dul.getConsentGroupKey())
            consent.put("dataManagerName", user.getDisplayName())
            consent.put("dataManagerEmail", user.getEmailAddress())
            consent.put("consentGroupKey", issue.getProjectKey())
            consent.put(IssueExtraProperty.SUMMARY, issue.getSummary())
            consent.put(IssueExtraProperty.PROTOCOL, IssueExtraProperty.findByProjectKeyAndName(dul.getConsentGroupKey(), IssueExtraProperty.PROTOCOL).getValue())
        }
        response.status = 200
        render([consent: consent] as JSON)
    }

}
