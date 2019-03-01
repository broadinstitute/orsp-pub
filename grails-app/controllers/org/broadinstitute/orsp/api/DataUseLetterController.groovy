package org.broadinstitute.orsp.api

import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.apache.pdfbox.pdmodel.PDDocument
import org.broadinstitute.orsp.AuthenticatedController
import org.broadinstitute.orsp.DataUseLetter
import org.broadinstitute.orsp.DataUseLetterService
import org.broadinstitute.orsp.DocumentStatus
import org.broadinstitute.orsp.StorageDocument
import org.broadinstitute.orsp.dataUseLetter.DataUseLetterFields
import org.broadinstitute.orsp.utils.DulPdfParser
import org.broadinstitute.orsp.utils.IssueUtils

import java.text.SimpleDateFormat

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'APPLICATION-MULTIPART'])
class DataUseLetterController extends AuthenticatedController {
    DataUseLetterService dataUseLetterService

    @Override
    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def create () {
        DataUseLetter inputDul = IssueUtils.getJson(DataUseLetter.class, request.JSON)
        try {
            DataUseLetter newDul = dataUseLetterService.generateDul(inputDul)
            response.status = 200
            render([dulToken: newDul.getUid()] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    @Override
    @SuppressWarnings(["GroovyAssignabilityCheck"])
    def update () {
        DataUseLetter input = IssueUtils.getJson(DataUseLetter.class, request.JSON)
        try {
            dataUseLetterService.udpateDataUseLetter(input)
            response.status = 200
            render(response.status)
        } catch(IllegalArgumentException e) {
            response.status = 400
            render([error: "Form has been already submitted"] as JSON)
        } catch(Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }

    def show() {
        String uid = request.parameterMap["id"]?.first()
        DataUseLetter dul = DataUseLetter.findByUid(uid)
        if(dul == null) {
            render(view: "/dataUseLetter/index", model: [error: 'notFound'])
        } else if(dul.submitted) {
            render(view: "/dataUseLetter/index", model: [error: 'submitted'])
        } else {
            render(view: "/dataUseLetter/index")
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
                response.status = 500
                log.error("Error trying to create Data Use Letter PDF for uid: " + dul.uid + e.message)
                render([error: e.message] as JSON)
            } finally {
                dulDOC.close()
                output.close()
            }
        } else {
            response.status = 404
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
                        creationDate: new SimpleDateFormat().format(new Date()),
                        status: DocumentStatus.PENDING.status
                )
                storageProviderService.saveStorageDocument(document, dulDoc)
            } else {
                throw new MissingResourceException("Unable to upload empty Data Use Letter pdf.")
            }
        } catch (Exception e) {
            response.status = 500
            render([error: e.message] as JSON)
        }
    }
}
