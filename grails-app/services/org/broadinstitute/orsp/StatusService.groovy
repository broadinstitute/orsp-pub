package org.broadinstitute.orsp

import com.google.common.cache.Cache
import com.google.common.cache.CacheBuilder
import grails.async.PromiseMap
import org.broadinstitute.orsp.webservice.DataBioOntologyService

import java.util.concurrent.Callable
import java.util.concurrent.TimeUnit

class StatusService {

    ConsentService consentService
    DataBioOntologyService dataBioOntologyService
    NotifyService notifyService
    OntologyService ontologyService
    QueryService queryService
    StorageProviderService storageProviderService

    private Cache<String, SubsystemStatus> cache = CacheBuilder.
            newBuilder().
            expireAfterWrite(1, TimeUnit.MINUTES).
            build()

    private SubsystemStatus getCachedSubsystem(String key, Callable<SubsystemStatus> callable) {
        try { cache.get(key, callable) }
        catch (e) { new SubsystemStatus(ok: false, messages: [e.message]) }
    }

    private final Callable<SubsystemStatus> database = new Callable<SubsystemStatus>() {@Override SubsystemStatus call() throws Exception { queryService.getStatus() }}
    private final Callable<SubsystemStatus> databio = new Callable<SubsystemStatus>() {@Override SubsystemStatus call() throws Exception { dataBioOntologyService.getStatus() }}
    private final Callable<SubsystemStatus> consent = new Callable<SubsystemStatus>() {@Override SubsystemStatus call() throws Exception { consentService.getStatus() }}
    private final Callable<SubsystemStatus> gcs = new Callable<SubsystemStatus>() {@Override SubsystemStatus call() throws Exception { storageProviderService.getStatus() }}
    private final Callable<SubsystemStatus> notify = new Callable<SubsystemStatus>() {@Override SubsystemStatus call() throws Exception { notifyService.getStatus() }}
    private final Callable<SubsystemStatus> ontology = new Callable<SubsystemStatus>() {@Override SubsystemStatus call() throws Exception { ontologyService.getStatus() }}

    def status() {
        try {
            PromiseMap<String, SubsystemStatus> statusMap = new PromiseMap<>()
            statusMap.put('Database', { getCachedSubsystem('Database', database) })
            statusMap.put('DataBioOntology', { getCachedSubsystem('DataBioOntology', databio) })
            statusMap.put('DUOS', { getCachedSubsystem('DUOS', consent) })
            statusMap.put('GCS', { getCachedSubsystem('GCS', gcs) })
            statusMap.put('Ontology', { getCachedSubsystem('Ontology', ontology) })
            Map<String, SubsystemStatus> subsystems = statusMap.get()
            new SystemStatus(
                    ok: subsystems.values().every { it.ok },
                    systems: subsystems)
        } catch (e) {
            new SystemStatus(ok: false, messages: [e.message])
        }
    }
}
