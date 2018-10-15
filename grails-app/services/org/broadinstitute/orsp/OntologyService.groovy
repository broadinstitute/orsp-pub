package org.broadinstitute.orsp

import com.google.common.cache.Cache
import com.google.common.cache.CacheBuilder
import com.google.gson.Gson
import com.google.gson.JsonElement
import grails.core.GrailsApplication
import groovy.util.logging.Slf4j
import groovyx.net.http.HttpBuilder
import org.broadinstitute.orsp.consent.DataUseDTO
import org.broadinstitute.orsp.webservice.ConsentOntologyService
import org.broadinstitute.orsp.webservice.DataBioOntologyService
import org.broadinstitute.orsp.webservice.Ontology
import org.broadinstitute.orsp.webservice.OntologyTerm
import org.springframework.http.MediaType

import java.util.concurrent.Callable
import java.util.concurrent.TimeUnit

/**
 * This class provides consolidated access to different ontology lookup services.
 * There are currently two that are available, Consent (in DUOS) and DataBioOntology. We prefer Consent as DSDE owns
 * it and DataBioOntology can have random outages.
 *
 * Consent provides an ontology service for:
 *   1. DOID ontology term searches,
 *   2. disease search matches,
 *   3. Use Restriction generation
 *
 * The DataBioOntology (http://data.bioontology.org/documentation) provides access to all ontologies and class
 * ancestors.
 *
 */
@Slf4j
class OntologyService implements Status {

    GrailsApplication grailsApplication
    ConsentOntologyService consentOntologyService
    DataBioOntologyService dataBioOntologyService
    QueryService queryService

    private Cache<String, OntologyTerm> termCache = CacheBuilder.
            newBuilder().
            expireAfterWrite(1, TimeUnit.DAYS).
            build()

    SubsystemStatus getStatus() {
        String statusUrl = (String) grailsApplication.config.consent.service.ontologyStatusUrl
        Gson gson = new Gson()
        HttpBuilder http = HttpBuilder.configure {
            request.uri = statusUrl
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
        }
        Map<String, ConsentSubsystem> statusMap = new HashMap<>()
        http.get(Map.class) {
            response.success {resp, json ->
                json.each {
                    ConsentSubsystem subsystem = gson.fromJson(gson.toJson(it.value), ConsentSubsystem.class)
                    statusMap.put(it.key.toString(), subsystem)
                }
            }
        }
        if (statusMap.isEmpty()) {
            new SubsystemStatus(ok: false, messages: ["No status available from Ontology"])
        }
        else if (statusMap.values.every { it.healthy }) {
            new SubsystemStatus(ok: true)
        } else {
            new SubsystemStatus(ok: false, messages: statusMap.values*.message)
        }
    }

    /**
     * Get the use restriction as a JsonElement from Ontology.
     *
     * @param dataUseDTO The DataUseDTO
     * @return Use Restriction JsonElement
     */
    JsonElement getUseRestriction(DataUseDTO dataUseDTO) {
        consentOntologyService.getUseRestriction(dataUseDTO)
    }

    /**
     * Get all disease ontology matches for a term.
     *
     * @param term The term
     * @return List of OntologyTerm objects
     */
    List<OntologyTerm> getDiseaseMatches(String term) {
        consentOntologyService.getDiseaseMatches(term)
    }

    /**
     * Get all population ontology matches for a term.
     *
     * @param term The term
     * @return List of OntologyTerm objects
     */
    List<OntologyTerm> getPopulationMatches(String term) {
        dataBioOntologyService.getPopulationMatches(term)
    }

    /**
     * Get the definition of an ontology class from its ontology and class id
     *
     * @param ontology The ontology for the class
     * @param classId The class ID string
     * @return OntologyTerm
     */
    OntologyTerm getOntologyClass(Ontology ontology, String classId) {
        try {
            switch (ontology) {
                case Ontology.POPULATION:
                    termCache.get(classId, new Callable<OntologyTerm>() {
                        @Override
                        OntologyTerm call() throws Exception {
                            dataBioOntologyService.getOntologyClass(ontology, classId)
                        }
                    })
                    break
                default:
                    termCache.get(classId, new Callable<OntologyTerm>() {
                        @Override
                        OntologyTerm call() throws Exception {
                            consentOntologyService.getOntologyClass(ontology, classId)
                        }
                    })
                    break
            }
        } catch (e) {
            log.error("Exception looking up term: ${e.message}")
            null
        }
    }

    /**
     * Get all ancestors for an ontology class.
     * TODO: Use ConsentOntologyService now that parents are returned for a class id lookup.
     *
     * @param term The term
     * @return List of OntologyTerm objects
     */
    List<OntologyTerm> getAncestors(Ontology ontology, String classId) {
        dataBioOntologyService.getOntologyClassAncestors(ontology, classId)
    }

}
