package org.broadinstitute.orsp

import com.google.gson.Gson
import com.google.gson.JsonElement
import groovy.util.logging.Slf4j
import groovyx.net.http.FromServer
import groovyx.net.http.HttpBuilder
import groovyx.net.http.OkHttpEncoders
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.config.ConsentConfiguration
import org.broadinstitute.orsp.consent.ConsentAssociation
import org.broadinstitute.orsp.consent.ConsentResource
import org.broadinstitute.orsp.consent.DataUseDTO
import org.broadinstitute.orsp.webservice.Ontology
import org.broadinstitute.orsp.webservice.OntologyTerm
import org.jsoup.Jsoup
import org.jsoup.examples.HtmlToPlainText
import org.springframework.http.MediaType

import java.text.DateFormat
import java.text.SimpleDateFormat

import static groovyx.net.http.MultipartContent.multipart

/**
 * Service to handle all requests to the DUOS consent service.
 */
@Slf4j
class ConsentService implements Status {

    ConsentConfiguration consentConfiguration
    OntologyService ontologyService
    QueryService queryService

    private static final String YES = "Yes"
    private static final String FEMALE = "Female"
    private static final String MALE = "Male"

    /**
     * Consent Codes come in three flavors, *_POS, *_NEG, and *_NA for when a DUR question is
     * positively answered, negatively answered, or not answered at all.
     * See https://broadinstitute.atlassian.net/browse/GAWB-1634 for more details
     */
    public static final String NRES_POS = "Data is available for future research with no restrictions. [NRES]"
    public static final String GRU_POS = "Data is available for general research use. [GRU]"
    public static final String HMB_POS = "Data is limited for health/medical/biomedical research. [HMB]"
    public static final String DS_POS = "Data use is limited for studying: %s [DS]"
    public static final String POA_POS = "Future use for population origins or ancestry research is prohibited. [POA]"
    public static final String NCU_POS = "Commercial use prohibited. [NCU]"
    public static final String NCU_NEG = "Commercial use is not prohibited."
    public static final String NCU_NA = NCU_NEG
    public static final String NMDS_POS = "Data use for methods development research ONLY within the bounds of other data use limitations. [NMDS]"
    public static final String NMDS_NEG = "Data use for methods development research irrespective of the specified data use limitations is not prohibited."
    public static final String NMDS_NA = NMDS_NEG
    public static final String NCTRL_POS = "Future use as a control set for diseases other than those specified is prohibited. [NCTRL]"
    public static final String NCTRL_NEG = "Future use as a control set for any type of health/medical/biomedical study is not prohibited."
    public static final String NCTRL_NA = "Restrictions for use as a control set for diseases other than those defined were not specified."
    public static final String RS_M_POS = "Data use is limited to research on males. [RS-M]"
    public static final String RS_FM_POS = "Data use is limited to research on females. [RS-FM]"
    public static final String RS_POS = "Data use is limited to research on population ontology ID(s): %s [RS]"
    public static final String RS_PD_POS = "Data use is limited to pediatric research. [RS-PD]"
    public static final String DATE_POS = "Data distributor must verify that data from samples collected before %s will not be shared."
    public static final String AGGREGATE_POS = "Aggregate level data for general research use is prohibited."
    public static final String MANUAL_REVIEW = "Data access requests will require manual review."

    // Terms of use/notes
    public static final String RECONTACT_MAY = "Subject re-contact may occur in certain circumstances, as specified: %s"
    public static final String RECONTACT_MUST = "Subject re-contact must occur in certain circumstances, as specified: %s"
    public static final String CLOUD_PROHIBITED = "Data storage on the cloud is prohibited."
    public static final String ETHICS_APPROVAL = "Local ethics committee approval is required."
    public static final String GEO_RESTRICTION = "Geographical restrictions: %s."
    public static final String OTHER_POS = "Other restrictions: %s."

    private static Boolean isSuccess(int status) {
        status >= 200 && status < 300
    }

    static String stripTextOfHtml(String text) {
        (!text || text.isEmpty()) ? "" : new HtmlToPlainText().getPlainText(Jsoup.parse(text)).trim()
    }

    private static String getTrimmedIdFromPopulation(String populationId) {
        populationId? populationId - "http://purl.bioontology.org/ontology/" : ""
    }

    private static String getTrimmedIdFromDisease(String termId) {
        termId? termId - "http://purl.obolibrary.org/obo/" : ""
    }

    static void throwConsentException(String message) {
        log.error(message)
        throw new ConsentException(message)
    }

    /**
     * Check to see if a consent exists at the given url.
     *
     * @param url
     * @return String value of the remote consent or null.
     */
    ConsentResource getConsent(String url) {
        ConsentResource consentResource = null
        HttpBuilder http = getBuilder(url)
        Map responseMap = (Map) http.get() {
            response.failure { FromServer fs ->
                log.info("Failure getting consent from url: $url")
                throwConsentException("Error getting consent for url: $url: ${fs.getMessage()}")
            }
            response.exception { t ->
                log.info("Exception getting consent from url: $url")
                throwConsentException("Unable to parse DUOS response: ${t.message}")
            }
        }
        if (responseMap) {
            try {
                consentResource = ConsentResource.fromMap(responseMap)
            } catch (IllegalArgumentException e) {
                throwConsentException("Unable to parse DUOS response: ${e.message}")
            }
        } else {
            throwConsentException("Unable to find consent at location: ${url}")
        }
        consentResource
    }

    /**
     * Upload a data use letter for a consent resource.
     *
     * @param consentLocation The location of the consent. Should be a full url
     * @param inputStream The input stream of the upload file
     * @return True if successful, false otherwise.
     */
    def postDataUseLetter(String consentLocation, InputStream inputStream, String fileName) {
        String url = consentLocation + "/dul"
        HttpBuilder http = getMultipartBuilder(url)
        String fileType = MediaType.APPLICATION_OCTET_STREAM_VALUE
        http.post(Boolean) {
            // "data" is the expected form field name in the consent service
            request.body = multipart {
                field 'fileName', fileName
                part 'data', fileName, fileType, inputStream

            }
            request.encoder MediaType.MULTIPART_FORM_DATA_VALUE, OkHttpEncoders.&multipart
            response.success { FromServer fs ->
                isSuccess(fs.statusCode)
            }
            response.failure { FromServer fs ->
                throwConsentException("Error posting data use letter: ${fs.getMessage()}")
            }
            response.exception { t ->
                throwConsentException("Exception posting data use letter: ${t.getMessage()}")
            }
        }
    }


    /**
     * Create or replace associations for a consent.
     *
     * @param consentLocation The location of the consent. Should be a full url
     * @param associations Collection of associations to set for this consent
     * @return True if successful, false otherwise.
     */
    def postConsentAssociations(String consentLocation, ConsentAssociation association) {
        if (association.associationType == null) {
            throw new IllegalArgumentException("Consent Association Type must be populated.")
        }
        if (association.elements.any { it == null || it.isEmpty()}) {
            throw new IllegalArgumentException("Consent Elements must be populated.")
        }
        HttpBuilder http = getBuilder(consentLocation + "/association")
        String json = new Gson().toJson(Collections.singletonList(association))
        http.post {
            request.body = json
            response.success {
                return true
            }
            response.failure { FromServer fs ->
                throwConsentException("Failure updating sample collections for location ${consentLocation}: ${fs.getMessage()}")
            }
            response.exception { t ->
                throwConsentException("Exception updating sample collections for location ${consentLocation}: ${t.getMessage()}")
            }
        }
    }

    /**
     * Create a consent and return the consent service location url that specifies the unique id for the created
     * resource. That resource can then be associated to a collection of samples if needed.
     *
     * @param consent The ConsentResource
     * @return URL location of the created consent resource
     */
    def postConsent(ConsentResource consent) {
        HttpBuilder http = getBuilder(consentConfiguration.url)
        String json = new Gson().toJson(consent)
        http.post {
            request.body = json
            response.success { FromServer fs ->
                return fs.getHeaders().find { h -> h.key == 'Location' }.value
            }
            response.failure { FromServer fs ->
                throwConsentException("Unable to post consent [${consent.name}]: ${fs.getMessage()}")
            }
            response.exception { t ->
                throwConsentException("Exception posting consent ${json}: ${t.getMessage()}")
            }
        }
    }

    /**
     * Update an existing consent
     *
     * @param consent The ConsentResource
     * @return True if the response is OK (200)
     */
    def updateConsent(ConsentResource consent, String consentLocation) {
        HttpBuilder http = getBuilder(consentLocation)
        String json = new Gson().toJson(consent)
        http.put {
            request.body = json
            response.success {
                return true
            }
            response.failure { FromServer fs ->
                throwConsentException("Failure updating consent [${consent.name}]: ${fs.getMessage()}")
            }
            response.exception { exception ->
                throwConsentException("Exception updating consent ${json}: ${exception}")
            }
        }
    }

    SubsystemStatus getStatus() {
        Gson gson = new Gson()
        HttpBuilder http = HttpBuilder.configure {
            request.uri = consentConfiguration.statusUrl
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
            new SubsystemStatus(ok: false, messages: ["No status available from DUOS"])
        }
        else if (statusMap.values.every { it.healthy }) {
            new SubsystemStatus(ok: true)
        } else {
            new SubsystemStatus(ok: false, messages: statusMap.values*.message)
        }
    }

    private HttpBuilder getBuilder(String url) {
        HttpBuilder.configure {
            request.uri = url
            request.contentType = MediaType.APPLICATION_JSON_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
            request.auth.basic consentConfiguration.username, consentConfiguration.password
        }
    }

    private HttpBuilder getMultipartBuilder(String url) {
        HttpBuilder.configure {
            request.uri = url
            request.contentType = MediaType.MULTIPART_FORM_DATA_VALUE
            request.headers['Accept'] = MediaType.APPLICATION_JSON_VALUE
            request.auth.basic consentConfiguration.username, consentConfiguration.password
        }
    }

    /**
     * Construct a valid consent resource acceptable for sending to DUOS.
     *
     * @return ConsentResource
     */
    ConsentResource buildConsentResource(DataUseRestriction dataUseRestriction, String consentGroupName = null) {
        def resource = new ConsentResource()
        resource.requiresManualReview = false
        resource.name = dataUseRestriction.consentGroupKey
        resource.groupName = consentGroupName
        resource.translatedUseRestriction = getSummary(dataUseRestriction).join("\n")
        DataUseDTO dataUseDTO = parseDataUseDto(dataUseRestriction)
        resource.dataUse = dataUseDTO
        JsonElement useRestriction = ontologyService.getUseRestriction(dataUseDTO)
        if (useRestriction && useRestriction.asJsonObject) {
            resource.useRestriction = useRestriction.asJsonObject
        }
        resource.requiresManualReview = dataUseRestriction.manualReview
        resource
    }

    /**
     * Convert a DataUseRestriction into a DataUseDTO suitable for sending to Ontology and
     * getting back a fully structured Use Restriction.
     *
     * @param dataUseRestriction
     * @return
     */
    DataUseDTO parseDataUseDto(DataUseRestriction dataUseRestriction) {
        DataUseDTO dataUseDTO = new DataUseDTO()

        if (dataUseRestriction.generalUse) {
            dataUseDTO.generalUse = true
        }

        if (dataUseRestriction.hmbResearch) {
            dataUseDTO.hmbResearch = true
        }

        if (dataUseRestriction.diseaseRestrictions) {
            dataUseDTO.diseaseRestrictions = dataUseRestriction.diseaseRestrictions
        }

        if (dataUseRestriction.populationOriginsAncestry) {
            dataUseDTO.populationOriginsAncestry = true
        }

        if (dataUseRestriction.commercialUseExcluded) {
            dataUseDTO.commercialUse = false
        }

        if (dataUseRestriction.methodsResearchExcluded) {
            dataUseDTO.methodsResearch = true
        }

        if (dataUseRestriction.aggregateResearchResponse?.equalsIgnoreCase(YES)) {
            dataUseDTO.aggregateResearch = YES
        }

        if (dataUseRestriction.controlSetOption?.equalsIgnoreCase(YES)) {
            dataUseDTO.controlSetOption = YES
        }

        if (dataUseRestriction.gender) {
            if (dataUseRestriction.gender.equalsIgnoreCase(MALE)) {
                dataUseDTO.gender = MALE
            }
            else if (dataUseRestriction.gender.equalsIgnoreCase(FEMALE)) {
                dataUseDTO.gender = FEMALE
            }
        }

        if (dataUseRestriction.pediatricLimited) {
            dataUseDTO.pediatric = true
        }

        if (dataUseRestriction.populationRestrictions) {
            dataUseDTO.populationRestrictions = dataUseRestriction.populationRestrictions
        }

        if (dataUseRestriction.dateRestriction) {
            // Using RFC 3339 date-time format compatible with json-schema date-time
            // https://tools.ietf.org/html/rfc3339#section-5.6
            DateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ssXXX")
            dataUseDTO.dateRestriction = sdf.format(dataUseRestriction.dateRestriction)
        }

        if (dataUseRestriction.genomicPhenotypicData?.equalsIgnoreCase(YES)) {
            dataUseDTO.genomicPhenotypicData = YES
        }

        if (dataUseRestriction.cloudStorage?.equalsIgnoreCase(YES)) {
            dataUseDTO.cloudStorage = YES
        }

        if (dataUseRestriction.irb) {
            dataUseDTO.ethicsApprovalRequired = true
        }

        if (dataUseRestriction.geographicalRestrictions) {
            dataUseDTO.setGeographicalRestrictions(dataUseRestriction.geographicalRestrictions)
        }

        if (dataUseRestriction.otherRestrictions) {
            dataUseDTO.otherRestrictions = true
        }

        if (dataUseRestriction.other) {
            dataUseDTO.setOther(stripTextOfHtml(dataUseRestriction.other).trim())
        }

        dataUseDTO
    }

    /**
     * Generate a textual summary that consists of an ordered list of restrictions.
     *
     * @param dataUseRestriction The DataUseRestriction
     * @return List of restrictions
     */
    List<String> getSummary(DataUseRestriction dataUseRestriction) {
        List<String> summary = ["Samples are restricted for use under the following conditions:"]

        if (dataUseRestriction == null) {
            return []
        }
        if (dataUseRestriction.noRestriction) summary.add(NRES_POS)
        if (dataUseRestriction.generalUse) summary.add(GRU_POS)
        if (dataUseRestriction.hmbResearch) summary.add(HMB_POS)
        if (dataUseRestriction.diseaseRestrictions) {
            Collection<String> dsRestrictions = dataUseRestriction.diseaseRestrictions.
                    findAll { !it.empty }.
                    collect { ontologyService.getOntologyClass(Ontology.DISEASE, it)?.label }.
                    findAll { it != null }
            summary.add(sprintf(DS_POS, dsRestrictions.join(", ")))
        }
        if (dataUseRestriction.populationOriginsAncestry) summary.add(POA_POS)
        dataUseRestriction.commercialUseExcluded == null ?
                summary.add(NCU_NA) :
                dataUseRestriction.commercialUseExcluded ? summary.add(NCU_POS) : summary.add(NCU_NEG)
        dataUseRestriction.methodsResearchExcluded == null ?
                summary.add(NMDS_NA) :
                dataUseRestriction.methodsResearchExcluded ? summary.add(NMDS_POS) : summary.add(NMDS_NEG)
        dataUseRestriction.controlSetOption == null || dataUseRestriction.controlSetOption.equalsIgnoreCase("Unspecified")?
                summary.add(NCTRL_NA) :
                dataUseRestriction.controlSetOption.equalsIgnoreCase("Yes") ? summary.add(NCTRL_POS) : summary.add(NCTRL_NEG)
        if (dataUseRestriction.gender?.equalsIgnoreCase(MALE)) summary.add(RS_M_POS)
        if (dataUseRestriction.gender?.equalsIgnoreCase(FEMALE)) summary.add(RS_FM_POS)
        if (dataUseRestriction.populationRestrictions) {
            Collection<String> popRestrictions = dataUseRestriction.populationRestrictions.
                    findAll { !it.empty }.
                    collect { getTrimmedIdFromPopulation(ontologyService.getOntologyClass(Ontology.POPULATION, it)?.id) }
            summary.add(sprintf(RS_POS, popRestrictions.join(", ")))
        }
        if (dataUseRestriction.pediatricLimited) summary.add(RS_PD_POS)
        if (dataUseRestriction.dateRestriction) {
            SimpleDateFormat formatter = new SimpleDateFormat("MM/dd/yyyy")
            summary.add(sprintf(DATE_POS, formatter.format(dataUseRestriction.dateRestriction)))
        }
        if (dataUseRestriction.aggregateResearchResponse?.equalsIgnoreCase(YES))
            summary.add(AGGREGATE_POS)
        if (dataUseRestriction.recontactMay) summary.add(sprintf(RECONTACT_MAY, dataUseRestriction.recontactMay))
        if (dataUseRestriction.recontactMust) summary.add(sprintf(RECONTACT_MUST, dataUseRestriction.recontactMust))
        if (dataUseRestriction.cloudStorage?.equalsIgnoreCase(YES)) summary.add(CLOUD_PROHIBITED)
        if (dataUseRestriction.irb) summary.add(ETHICS_APPROVAL)
        if (dataUseRestriction.geographicalRestrictions && !dataUseRestriction.geographicalRestrictions.isEmpty()) summary.add(sprintf(GEO_RESTRICTION, dataUseRestriction.geographicalRestrictions))
        if (dataUseRestriction.other && !dataUseRestriction.other.isEmpty()) summary.add(sprintf(OTHER_POS, stripTextOfHtml(dataUseRestriction.other)))
        if (dataUseRestriction.manualReview) summary.add(MANUAL_REVIEW)
        summary
    }

    /**
     * Generate a textual summary that consists of an ordered list of restrictions that represents a DUR in minimal form
     *
     * @param dataUseRestriction The DataUseRestriction
     * @return List of restrictions
     */
    List<String> getMinimizedSummary(DataUseRestriction dataUseRestriction) {
        List<String> summary = new ArrayList<>()
        if (dataUseRestriction.generalUse) summary.add("GRU")
        if (dataUseRestriction.hmbResearch) summary.add("HMB")
        if (dataUseRestriction.diseaseRestrictions) {
            dataUseRestriction.diseaseRestrictions.each {
                OntologyTerm term = ontologyService.getOntologyClass(Ontology.DISEASE, it)
                if (term != null) {
                    summary.add("DS-" + term.label + " (" + getTrimmedIdFromDisease(term.id) + ")")
                } else {
                    summary.add("DS-" + getTrimmedIdFromDisease(it))
                }
            }
        }
        if (dataUseRestriction.commercialUseExcluded) summary.add("NCU")
        if (dataUseRestriction.methodsResearchExcluded) summary.add("NMDS")
        if (dataUseRestriction.gender?.toString()?.equalsIgnoreCase(MALE)) summary.add("RS-M")
        if (dataUseRestriction.gender?.toString()?.equalsIgnoreCase(FEMALE)) summary.add("RS-F")
        if (dataUseRestriction.populationRestrictions) {
            dataUseRestriction.populationRestrictions.each {
                OntologyTerm term = ontologyService.getOntologyClass(Ontology.POPULATION, it)
                if (term != null) {
                    summary.add("POP-" + term.label + " (" + getTrimmedIdFromPopulation(term.id) + ")")
                } else {
                    summary.add("POP-" + getTrimmedIdFromPopulation(it))
                }
            }
        }
        if (dataUseRestriction.pediatricLimited) summary.add("RS-PD")
        if (dataUseRestriction.recontactingDataSubjects) summary.add("Recontacting subjects is allowed.")
        if (dataUseRestriction.cloudStorage?.equalsIgnoreCase(YES)) summary.add("Cloud storage is not allowed.")
        if (dataUseRestriction.irb) summary.add("Ethics committed approval required.")
        if (dataUseRestriction.geographicalRestrictions && !dataUseRestriction.geographicalRestrictions.isEmpty()) summary.add(sprintf("Geographical restrictions exist: %s", dataUseRestriction.geographicalRestrictions))
        if (dataUseRestriction.other && !dataUseRestriction.other.isEmpty()) {
            String otherText = stripTextOfHtml(dataUseRestriction.other)
            if (otherText.length() > 75) {
                otherText = sprintf("See %s for more information.", dataUseRestriction.consentGroupKey)
            }
            summary.add(sprintf("Other restrictions exist: %s", otherText))
        }
        if (dataUseRestriction.manualReview) summary.add(MANUAL_REVIEW)
        summary
    }

    LinkedHashMap findProjectConsentGroups(String projectKey) {
        if (StringUtils.isNotEmpty(projectKey)) {
            Issue issue = queryService.findByKey(projectKey)
            Collection<ConsentCollectionLink> collectionLinks = ConsentCollectionLink.findAllByProjectKey(issue.projectKey)
            Map<String, ConsentCollectionLink> collectionLinksMap = collectionLinks?.collectEntries{[it.consentKey, it]}
            Collection consentGroups = queryService.findByKeys(collectionLinksMap)
            [
                issue        : issue,
                consentGroups: consentGroups?.sort { a, b -> a.summary?.toLowerCase() <=> b.summary?.toLowerCase() }
            ]
        } else {
            log.error("Error trying to get Project's Consent groups: Empty projectKey")
            throw new IllegalArgumentException("Error trying to get Project's Consent groups: Empty projectKey")
        }
    }
}
