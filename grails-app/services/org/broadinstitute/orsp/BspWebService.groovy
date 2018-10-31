package org.broadinstitute.orsp

import com.google.gson.Gson
import groovy.util.logging.Slf4j
import groovyx.net.http.FromServer
import groovyx.net.http.HttpBuilder
import org.broadinstitute.orsp.config.BspConfiguration
import org.broadinstitute.orsp.webservice.BspCollection

import static groovyx.net.http.HttpBuilder.configure

@Slf4j
class BspWebService implements Status {

    BspConfiguration bspConfiguration
    Gson gson = new Gson()

    SubsystemStatus getStatus() {
        SubsystemStatus status = new SubsystemStatus()
        String serviceUrl = bspConfiguration.service.statusUrl
        try {
            HttpBuilder http = configure {
                request.uri = serviceUrl
            }
            http.head(Boolean) {
                response.success { status.ok = true }
                response.failure { FromServer fromServer ->
                    log.error(fromServer.message)
                    status.ok = false
                    status.messages = [fromServer.message]
                }
            }
        } catch (Exception e) {
            log.error("Error accessing BSP service: ${e.getMessage()}")
            status.ok = false
            status.messages = [e.getMessage()]
        }
        status
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

    Collection<SampleCollection> syncSampleCollections() {
        Collection<SampleCollection> syncedCollections = findMissingBspCollections().collect {
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
     * @return
     */
    private List<BspCollection> findMissingBspCollections() {
        Map<String, SampleCollection> dbCollections = SampleCollection.findAll().collectEntries {[it.collectionId, it]}
        getBspCollections().findAll { !dbCollections.containsKey(it.id) }
    }

    private String getResponse(String url) {
        HttpBuilder http = configure {
            request.uri = url
            request.auth.basic bspConfiguration.service.username, bspConfiguration.service.password
        }
        http.get(String) {}
    }

}
