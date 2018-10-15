package org.broadinstitute.orsp.webservice

import com.google.gson.JsonElement
import com.google.gson.JsonObject
import com.google.gson.JsonParser
import groovy.util.logging.Slf4j
import groovyx.net.http.ChainedHttpConfig
import groovyx.net.http.FromServer
import groovyx.net.http.HttpBuilder
import org.apache.commons.lang.CharEncoding
import org.broadinstitute.orsp.Status
import org.broadinstitute.orsp.SubsystemStatus
import org.springframework.http.MediaType

/**
 * Web Service manager for all calls to the Data Bio Ontology web services. 
 *
 * Created: 8/11/14
 *
 * @author <a href="mailto:grushton@broadinstitute.org">grushton</a>
 */
@Slf4j
class DataBioOntologyService implements Status {

    private static final JsonParser PARSER = new JsonParser()

    def grailsApplication

    private String getSearchUrl() {
        (String) grailsApplication.config.dataBio.searchUrl
    }

    private String getStatusUrl() {
        (String) grailsApplication.config.dataBio.statusUrl
    }

    private String getOntologyClassUrl() {
        (String) grailsApplication.config.dataBio.classUrl
    }

    private String getApiKey() {
        (String) grailsApplication.config.dataBio.apiKey
    }

    /**
     * Utility method to get OntologyTerms from a page of results
     *
     * @param term Search Term
     * @param page Page to parse
     * @return List of OntologyTerm objects on this page of results
     */
    private List<OntologyTerm> processSearchPage(Ontology ontology, String term, Integer page) {
        String response = getSearchResponse(ontology, term, page)
        JsonElement result = PARSER.parse(response)
        return parseMatchesFromResult(result)
    }

    /**
     * Utility method to safely construct a term from a json object
     *
     * @param term
     * @return OntologyTerm
     */
    @SuppressWarnings("GrMethodMayBeStatic")
    private OntologyTerm makeTermFromJsonObject(JsonObject term) {
        new OntologyTerm(
                label: term.get("prefLabel")?.getAsString(),
                synonyms: term.get("synonym")?.getAsJsonArray(),
                definition: term.get("definition")?.getAsJsonArray(),
                obsolete: term.get("obsolete")?.getAsBoolean(),
                id: term.get("@id")?.getAsString(),
                type: term.get("@type")?.getAsString()
        )
    }

    /**
     * Utility method to get OntologyTerm from a result object
     *
     * @param result JSON String to parse results from
     * @return List of OntologyTerm objects in this group of results
     */
    @SuppressWarnings("GrMethodMayBeStatic")
    private List<OntologyTerm> parseMatchesFromResult(JsonElement result) {
        List<OntologyTerm> matches = new ArrayList<>()
        if (result && result.isJsonObject()) {
            def collection = result.getAsJsonObject().get("collection")
            if (collection && collection.isJsonArray()) {
                collection.getAsJsonArray().collect(matches) {
                    makeTermFromJsonObject(it.getAsJsonObject())
                }
            }
        }
        matches
    }

    /**
     * Utility method to get the raw response from the web service provider.
     *
     * @param term The search term
     * @param page The page to get
     * @return Full results as a string
     */
    private String getSearchResponse(Ontology ontology, String term, Integer page) {
        getBuilder(getSearchUrl()) get(String) {
            request.uri.query = [
                    apikey: getApiKey(),
                    ontology: ontology.abbreviation,
                    include_links: false,
                    include_context: false,
                    q: term,
                    page: String.valueOf(page)
            ]
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
        }
    }

    /**
     * Utility method to get the json representation of a specific ontology class.
     *
     * @param ontology The Ontology name, i.e. DOID, SNOMEDCT, SYMP, etc.
     * @param classId The id of the ontology class.
     *
     * @return JSON result of the web service call.
     */
    private String getClassResponse(Ontology ontology, String classId) {
        String url = getOntologyClassUrl() + "/" + ontology.abbreviation + "/classes/" + URLEncoder.encode(classId, CharEncoding.UTF_8)
        getBuilder(url) get(String) {
            request.uri.query = [apikey: getApiKey()]
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
        }
    }

    /**
     * Utility method to get the json representation of ancestors of an ontology class.
     *
     * @param ontology The Ontology name, i.e. DOID, SNOMEDCT, SYMP, etc.
     * @param classId The id of the ontology class.
     *
     * @return JSON result of the web service call.
     */
    private String getAncestorResponse(Ontology ontology, String classId) {
        String url = getOntologyClassUrl() + "/" + ontology.abbreviation + "/classes/" + URLEncoder.encode(classId, CharEncoding.UTF_8) + "/ancestors"
        getBuilder(url) get(String) {
            request.uri.query = [apikey: getApiKey()]
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
        }
    }

    /**
     * Utility method to get the json representation of descendants of an ontology class.
     *
     * @param ontology The Ontology name, i.e. DOID, SNOMEDCT, SYMP, etc.
     * @param classId The id of the ontology class.
     *
     * @return JSON result of the web service call.
     */
    private String getDescendantPage(Ontology ontology, String classId, Integer page) {
        String url = getOntologyClassUrl() + "/" + ontology.abbreviation + "/classes/" + URLEncoder.encode(classId, CharEncoding.UTF_8) + "/descendants"
        getBuilder(url) get(String) {
            request.uri.query = [apikey: getApiKey(), page: String.valueOf(page)]
            response.parser(MediaType.APPLICATION_JSON_VALUE) { ChainedHttpConfig cfg, FromServer fs ->
                fs.inputStream.text
            }
        }
    }

    SubsystemStatus getStatus() {
        SubsystemStatus status = new SubsystemStatus()
        HttpBuilder http = HttpBuilder.configure {
            request.uri = getStatusUrl()
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
        }
        try {
            // Head requests aren't working to databio via http builder, but curl does work :-(
            http.get(Boolean) {
                response.success { status.ok = true }
                response.failure { FromServer fromServer ->
                    log.error(fromServer.message)
                    status.ok = false
                    status.messages = [fromServer.message]
                }
            }
        } catch (Exception e) {
            log.error("Error accessing DataBioOntology: ${e.message}")
            status.ok = false
            status.messages = [e.message]
        }
        status
    }

    /**
     * Get all population ontology matches for a term.
     *
     * @param term The term
     * @return List of OntologyTerm objects
     */
    List<OntologyTerm> getPopulationMatches(String term) {
        List<OntologyTerm> matches = new ArrayList<>()
        JsonElement result = PARSER.parse(getSearchResponse(Ontology.POPULATION, term, 1))
        matches.addAll(parseMatchesFromResult(result).findAll { it.synonyms?.any { it.contains("ethnic group")} })

        def pageCount = result.get("pageCount").asInt ?: 1
        (2 .. pageCount).each {
            matches.addAll(processSearchPage(Ontology.POPULATION, term, it).findAll { it.synonyms?.any { it.contains("ethnic group")} })
        }

        matches.unique { it.id }
    }

    /**
     * Get the definition of an ontology class from its ontology and class id
     *
     * @param ontology The ontology for the class
     * @param classId The class ID
     * @return Match
     */
    @SuppressWarnings("GroovyUnusedDeclaration")
    OntologyTerm getOntologyClass(Ontology ontology, String classId) {
        OntologyTerm match = null
        String response = getClassResponse(ontology, classId)
        try {
            JsonObject result = PARSER.parse(response).getAsJsonObject()
            match = makeTermFromJsonObject(result)
        } catch (Exception e) {
            // Ignore errors from this call - it will mean nothing was found or a URL error occurred.
            log.warn("Unable to parse results from " + response + ", " + e.getMessage())
        }
        match
    }

    /**
     * Get the ancestors for an ontology class.
     *
     * @param ontology The ontology for the class
     * @param classId The class ID
     * @return Matches
     */
    List<OntologyTerm> getOntologyClassAncestors(Ontology ontology, String classId) {
        List<OntologyTerm> matches = new ArrayList<>()
        JsonObject result = PARSER.parse(getAncestorResponse(ontology, classId)).getAsJsonObject()
        result?.collect(matches) { makeTermFromJsonObject(it) }
        matches.unique { it.id }
    }

    /**
     * Get the descendants for an ontology class.
     *
     * @param ontology The ontology for the class
     * @param classId The class ID
     * @return Matches
     */
    List<OntologyTerm> getOntologyClassDescendants(Ontology ontology, String classId) {
        List<OntologyTerm> matches = new ArrayList<>()
        // Get the first page, and if there are more, grab those too.
        JsonElement result = PARSER.parse(getDescendantPage(ontology, classId, 1))
        matches.addAll(parseMatchesFromResult(result))
        if (result.isJsonObject()) {
            def pageCount = result.getAsJsonObject()?.get("pageCount")?.asInt ?: 1
            if (pageCount > 1) {
                (2 .. pageCount).each {
                    def pageXResults = getDescendantPage(ontology, classId, it)
                    def pagedResult = PARSER.parse(pageXResults)
                    matches.addAll(parseMatchesFromResult(pagedResult))
                }
            }
        }
        matches.unique { it.id }
    }

    private static HttpBuilder getBuilder(String url) {
        HttpBuilder.configure {
            request.uri = url
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
        }
    }

}
