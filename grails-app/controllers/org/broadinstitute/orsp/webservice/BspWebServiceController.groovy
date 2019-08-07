package org.broadinstitute.orsp.webservice

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.BspWebService
import org.broadinstitute.orsp.SampleCollection

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'CSV', "PLAIN"])
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

    def save() {
        List<MultipartFile> files = request.multiFileMap.collect { it.value }.flatten()
        render bspWebService.syncSampleCollections() as JSON
    }

    List<BspCollection> getBspCollections() {
        List<BspCollection> collections = new ArrayList<>()
        String serviceUrl = bspConfiguration.service.allSampleCollectionsUrl
        getResponse(serviceUrl).splitEachLine('\t') {
            elements ->
                collections.add(
                        new BspCollection(
                                id: elements[0],
                                name: elements[1],
                                category: elements[2],
                                groupName: elements[3],
                                archived: elements[4]
                        )
                )
        }
        // The first one is the header. Remove it before returning full list, if there is one.
        if (!collections.isEmpty()) {
            collections.remove(0)
        }
        collections
    }

}
