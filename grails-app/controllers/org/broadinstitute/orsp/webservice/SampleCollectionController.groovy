package org.broadinstitute.orsp.webservice

import com.google.gson.Gson
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.SampleCollection
import org.springframework.web.multipart.MultipartFile

import groovyx.net.http.HttpBuilder
import org.broadinstitute.orsp.webservice.BspCollection

@Slf4j
@Resource(readOnly = false, formats = ['JSON', 'CSV'])
class SampleCollectionController {

    Gson gson = new Gson()

    def index() {
        def json = gson.toJson("Unimplemented")
        render(text: json, contentType: "application/json")
    }

    def sampleCollections() {
        Collection<SampleCollection> sampleCollections = SampleCollection.findAll()
        String json = gson.toJson(sampleCollections)
        render(text: json, contentType: "application/json")
    }

    /**
     * Receives a csv file containing all BSP Sample Collections 
     * from a cron job running in Broad's internal network, 
     * finds out new sample collection (not in ORSP db)
     * and save it on ORSP db.
     *
     * @return List of added sample collections
     */
    def save() {
        List<BspCollection> collections = new ArrayList<>()
        request.reader.text.splitEachLine('\t') {
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

        Collection<SampleCollection> syncedCollections = findMissingBspCollections(collections).collect {
            SampleCollection sc = new SampleCollection()
            sc.setCollectionId(it.id)
            sc.setArchived(it.archived)
            sc.setCategory(it.category)
            sc.setGroupName(it.groupName)
            sc.setName(it.name)
            try {
                sc.save()
                sc
            } catch (Exception e) {
                log.error("Unable to save sample collection from BSP: ${gson.toJson(it).toString()}; Reason: ${e.getMessage()}")
                null
            }
        }
        log.info("Synchronized ${syncedCollections.size()} sample collections at: ${new Date().getDateTimeString()}")
        syncedCollections
    }

    /**
     * Find all BSP Sample Collections that we do not know about in ORSP.
     *
     * @return List of new BSP Sample Collections
     */
    private List<BspCollection> findMissingBspCollections(List<BspCollection> bspCollections ) {
        Map<String, SampleCollection> dbCollections = SampleCollection.findAll().collectEntries {[it.collectionId, it]}
        bspCollections.findAll { !dbCollections.containsKey(it.id) }
    }

}
