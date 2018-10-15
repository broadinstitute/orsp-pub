package org.broadinstitute.orsp


import com.google.gson.Gson
import grails.converters.JSON
import org.broadinstitute.orsp.webservice.ApiService
import org.broadinstitute.orsp.webservice.DataBioOntologyService
import org.broadinstitute.orsp.webservice.Ontology

/**
 * Generic, unauthenticated API endpoint
 */
class ApiController {

    ApiService apiService
    DataBioOntologyService dataBioOntologyService
    SwaggerService swaggerService
    StatusService statusService

    def index() {
        swaggerService.handleRequest(request)
    }

    // Render all swagger related content
    def swagger() {
        swaggerService.handleRequest(request)
    }

    def status() {
        // We do this to-from conversion because Gson excludes null/empty objects
        // whereas the grails JSON converter does not
        Gson gson = new Gson()
        Object status = gson.fromJson(gson.toJson(statusService.status()), Object.class)
        render status as JSON
    }

    // Summary of all data use projects
    def projects() {
        render apiService.getProjectSummaries((String) params.get("term")) as JSON
    }

    // Summary of all samples in use
    def samples() {
        render apiService.getSampleSummaries() as JSON
    }

    // Summary of all consents with sample collection and data use restriction info
    def consents() {
        render apiService.getConsents() as JSON
    }

    def descendants() {
        if (params.get("term")) {
            render dataBioOntologyService.getOntologyClassDescendants(
                    Ontology.DISEASE,
                    params.get("term").toString()
            ) as JSON
        } else {
            render Collections.emptyList() as JSON
        }
    }

    def bookit() {
        render apiService.getBookitSummaries() as JSON
    }

}
