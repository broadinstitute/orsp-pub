package org.broadinstitute.orsp.webservice

import com.google.gson.Gson
import com.google.gson.JsonElement
import com.google.gson.JsonParser
import groovy.json.JsonSlurper
import groovy.util.logging.Slf4j
import groovyx.net.http.ChainedHttpConfig
import groovyx.net.http.FromServer
import groovyx.net.http.HttpBuilder
import org.broadinstitute.orsp.consent.DataUseDTO
import org.springframework.http.MediaType

/**
 * Ontology lookup service hosted by DSDE Consent Ontology Service
 */
@Slf4j
class ConsentOntologyService {

    def grailsApplication
    private static final JsonSlurper SLURPER = new JsonSlurper()

    /**
     * Get all disease ontology matches for a term.
     *
     * @param term The term
     * @return List of OntologyTerm objects
     */
    List<OntologyTerm> getDiseaseMatches(String term) {
        List<OntologyTerm> matches = new ArrayList<>()
        def result = SLURPER.parseText(getAutocompleteResponse(term))
        matches.addAll(parseMatchesFromResult(Ontology.DISEASE, result))
        matches.unique { it.id }
    }

    /**
     * Get the definition of an ontology class from its ontology and class id
     *
     * @param ontology The ontology for the class
     * @param classId The class ID
     * @return Match
     */
    OntologyTerm getOntologyClass(Ontology ontology, String classId) {
        List<OntologyTerm> matches = new ArrayList<>()
        def result = SLURPER.parseText(getSearchResponse(classId))
        matches.addAll(parseMatchesFromResult(ontology, result))
        (matches?.size() > 0) ?
                matches.find { it.id?.equalsIgnoreCase(classId)} :
                null
    }

    /**
     * Get the Use Restriction json structure from Ontology.
     *
     * @param dataUseDTO The DataUseDTO
     * @return Use Restriction String
     */
    JsonElement getUseRestriction(DataUseDTO dataUseDTO) {
        String json = new Gson().toJson(dataUseDTO).toString()
        String url = (String) grailsApplication.config.consent.service.ontologyUrl + "schemas/data-use/consent/translate"
        HttpBuilder http = getBuilder(url)
        String duDtoString = http.post(String) {
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.body = json
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
            response.failure { FromServer fs ->
                log.error("Error calling ontology service: ${fs.getMessage()}")
            }
        }
        if (duDtoString) {
            new JsonParser().parse(duDtoString)
        } else {
            null
        }
    }

    /**
     * Utility method to get OntologyTerm from a result object
     *
     * @param result JSON String to parse results from
     * @return List of OntologyTerm objects in this group of results
     */
    private static List<OntologyTerm> parseMatchesFromResult(Ontology ontology, Object result) {
        List<OntologyTerm> matches = new ArrayList<>()
        result?.each {
            try {
                if ( ((String) it.id).contains(ontology.abbreviation) ) {
                    matches.add(
                            new OntologyTerm(
                                    id: it.id,
                                    label: it.label,
                                    synonyms: it.synonyms,
                                    definition: [it.definition],
                                    obsolete: false,
                                    type: null
                            )
                    )
                }
            } catch (Exception e) {
                // Errors here are generally non-fatal and should not impact the user's workflow.
                log.warn("Cannot extract an ontology match from message: " + it + e.message)
            }
        }
        matches
    }

    /**
     * Get the raw autocomplete response from the web service provider.
     *
     * @param term The search term
     * @param page The page to get
     * @return Full results as a string
     */
    private String getAutocompleteResponse(String term) {
        String url = grailsApplication.config.consent.service.ontologyUrl + "autocomplete"
        HttpBuilder http = getBuilder(url)
        http.get(String) {
            request.uri.query = [q: term]
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
        }
    }

    /**
     * Get the raw search response from the web service provider.
     *
     * @param term The search term
     * @param page The page to get
     * @return Full results as a string
     */
    private String getSearchResponse(String term) {
        String url = grailsApplication.config.consent.service.ontologyUrl + "search"
        HttpBuilder http = getBuilder(url)
        http.get(String) {
            request.uri.query = [id: term]
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
        }
    }

    private static HttpBuilder getBuilder(String url) {
        HttpBuilder.configure {
            request.uri = url
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
        }
    }


}
