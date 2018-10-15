package org.broadinstitute.orsp

import grails.async.PromiseList
import groovy.util.logging.Slf4j
import groovyx.net.http.Method
import groovyx.net.http.HTTPBuilder

@Slf4j
@SuppressWarnings("GrUnresolvedAccess")
class CrowdService implements Status {

    def grailsApplication
    UserService userService

    private Integer getInterval() {
        grailsApplication.config?.crowd?.interval ?: 500
    }

    private Integer getRange() {
        grailsApplication.config?.crowd?.range ?: 10
    }

    private String getUsername() {
        grailsApplication.config?.crowd?.username
    }

    private String getPassword() {
        grailsApplication.config?.crowd?.password
    }

    private String getCredentials() {
        String plainCreds = getUsername() + ":" + getPassword()
        plainCreds.bytes.encodeBase64().toString()
    }

    private String getSearchUri(Integer startIndex) {
        grailsApplication.config.crowd.url +
                "/rest/usermanagement/latest/search?" +
                "entity-type=user&expand=user&restriction=active%3Dtrue&max-results=${getInterval()}&start-index=${startIndex * getInterval()}"
    }

    SubsystemStatus getStatus() {
        SubsystemStatus status = new SubsystemStatus()
        String serviceUrl = (String) grailsApplication.config.crowd.url
        try {
            def http = new HTTPBuilder(serviceUrl)
            http.request(Method.HEAD) {
                headers.Accept = 'application/json'
                headers."User-Agent" = "ORSP" + (String) grailsApplication.config.info.app.version
                headers.Authorization = "Basic " + getCredentials()
                response.success = {
                    status.ok = true
                }
                response.failure = { resp ->
                    status.ok = false
                    status.messages = [resp]
                }
            }
        } catch (Exception e) {
            log.error("Error accessing Crowd ${e.message}")
            status.ok = false
            status.messages = [e.getMessage()]
        }
        status
    }
    /**
     * Find all valid users that exist in Crowd, but not in ORSP as a List of CrowdUserDetail
     * objects from all possible search queries Broad's Crowd has a limit of 500 so break up
     * the search queries to return 500 at a time. Make the calls via async Promises so we're
     * not blocking on lots of crowd queries
     *
     * @return List of CrowdUserDetail objects
     */
    @SuppressWarnings("GroovyAssignabilityCheck")
    List<CrowdUserDetail> findMissingUsers() {
        Collection<String> filterUsers = userService.findAllUserNames()
        PromiseList promises = new PromiseList()
        (0..getRange()).each {
            range -> promises << {
                getCrowdQueryUserDetails(filterUsers, getSearchUri(range))
            }
        }
        promises.onError { Throwable t -> log.error(t.getMessage()) }
        promises.onComplete { List<CrowdUserDetail> results -> results }
        PromiseUtil.promisesGet(promises, "Crowd User Update").
                flatten().
                unique { userDetail -> userDetail.userName }
    }

    /**
     * Return a List of CrowdUserDetail objects from a single search query
     *
     * Note that this is not updated to the latest HttpBuilder code. The
     * version used here is TLSv1 friendly out of the box, while HttpBuilder
     * is not.
     *
     * @param filterUsers Collection of userNames to filter on
     * @param uri Full query url to crowd search
     * @return List of CrowdUserDetail objects
     */
    private List<CrowdUserDetail> getCrowdQueryUserDetails(Collection<String> filterUsers, String uri) {
        List<CrowdUserDetail> crowdUsers = new ArrayList<>()
        def http = new HTTPBuilder(uri)
        http.request(Method.GET) { req->
            headers.Accept = 'application/json'
            headers."User-Agent" = "ORSP" + (String) grailsApplication.config.info.app.version
            headers.Authorization = "Basic " + getCredentials()
            response.success = { resp, json ->
                json.users?.
                        findAll { it.email && !filterUsers.contains(it.name) }?.
                        collect(crowdUsers) {
                            new CrowdUserDetail(
                                    userName: it.name,
                                    firstName: it["first-name"],
                                    lastName: it["last-name"],
                                    displayName: it["display-name"],
                                    email: it.email)
                        }
            }

            response.failure = { resp ->
                log.error("Got response: ${resp.statusLine}")
                log.error("Content-Type: ${resp.headers.'Content-Type'}")
            }
        }

        crowdUsers
    }

}
