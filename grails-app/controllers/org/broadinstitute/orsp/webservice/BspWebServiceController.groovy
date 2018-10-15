package org.broadinstitute.orsp.webservice

import com.google.gson.Gson
import grails.converters.JSON
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.BspWebService
import org.broadinstitute.orsp.SampleCollection

@Slf4j
class BspWebServiceController {

    Gson gson = new Gson()
    BspWebService bspWebService

    def index() {
        def json = gson.toJson("Unimplemented")
        render(text: json, contentType: "application/json")
    }

    def sampleCollections() {
        Collection<SampleCollection> sampleCollections = SampleCollection.findAll()
        String json = gson.toJson(sampleCollections)
        render(text: json, contentType: "application/json")
    }

    def sync() {
        render bspWebService.syncSampleCollections() as JSON
    }

}
