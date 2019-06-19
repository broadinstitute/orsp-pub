package org.broadinstitute.orsp.utils

import com.google.gson.Gson
import grails.web.servlet.mvc.GrailsParameterMap
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.Issue
import org.broadinstitute.orsp.IssueSearchItemDTO
import org.broadinstitute.orsp.IssueType

@Slf4j
final class IssueUtils {

    static Boolean isIrb(String issueTypeName) {
        IssueType.IRB.getName() == issueTypeName
    }

    static Boolean isNE(String issueTypeName) {
        IssueType.NE.getName() == issueTypeName
    }

    static Boolean isNHSR(String issueTypeName) {
        IssueType.NHSR.getName() == issueTypeName
    }

    static String getControllerForIssueTypeName(String issueTypeName) {
        def controller
        switch(issueTypeName) {
            case IssueType.IRB.getName():
                controller = IssueType.IRB.controller
                break
            case IssueType.NHSR.getName():
                controller = IssueType.NHSR.controller
                break
            case IssueType.NE.getName():
                controller = IssueType.NE.controller
                break
            case IssueType.CONSENT_GROUP.getName():
                controller = IssueType.CONSENT_GROUP.controller
                break
            default:
                controller = ""
                break
        }
        return controller
    }

    /**
     * Utility method to pull property maps out of multiple nested values
     *
     * Potential multi-params arrive in the form of:
     * [ "source": ["Federal", "Other"], "id": ["1015", "2809"], "name": ["test1", "test2"], "award": ["a1", "a2"] ]
     *
     *
     * OR ... when there really is only a single value of a potential multi-param object:
     * [ "source": "Federal", "id": "1015", "name": "test1", "award": "a1" ]
     *
     *
     * This manipulations turns that into
     * [ ["source": "Federal", "id": "1015", "name": "test1", "award": "a1"],
     *   ["source": "Other",   "id": "2809", "name": "test2", "award": "a2"] ]
     *
     * Which can then be coerced to new objects by using them in the default property constructor.
     *
     * @param params GrailsParameterMap
     * @return List of property maps
     */
    static List<Map<String, Object>> convertNestedParamsToPropertyList(GrailsParameterMap params) {
        def input = new ArrayList<LinkedHashMap>()
        params.each { param ->
            def entry = new LinkedHashMap()
            entry.put(param.key, param.value)
            input.add(entry)
        }
        try {
            Integer rangeSizeOfValues = input.collect { lhm ->
                lhm.keySet().collect { key -> [lhm.get(key)].flatten().size() }.max()
            }.max()
            List<Map<String,Object>> propertyBindings = new ArrayList<>()
            if (rangeSizeOfValues && rangeSizeOfValues > 0) {
                propertyBindings = (0..rangeSizeOfValues - 1).collect { index ->
                    Map<String, Object> props = new HashMap<>()
                    input.each { linkedMap ->
                        linkedMap.keySet().each { key ->
                            props.put(key as String, [linkedMap.get(key)].flatten().get(index))
                        }
                    }
                    props
                }
            }
            propertyBindings
        } catch (Exception e) {
            log.error("Exception unbinding funding parameters: ${input}", e)
            Collections.emptyList()
        }
    }

    static getJson(Class type, Object json) {
        Gson gson = new Gson()
        gson.fromJson(gson.toJson(json), type)

    }

    static Boolean getBooleanForParam(String param) {
        if ("Yes".equalsIgnoreCase(param) || "true".equalsIgnoreCase(param)) return true
        if ("No".equalsIgnoreCase(param) || "false".equalsIgnoreCase(param)) return false
        null
    }

    static Map<String, Object> generateArgumentsForRedirect(Issue issue, String id, String tab) {
        Map<String, Object> arguments = new HashMap<>()
        if (isConsentGroup(issue)) {
            arguments.put("controller", "newConsentGroup")
            arguments.put("action", "main")
            tab != null ? arguments.put("params", [consentKey: issue.projectKey, tab: tab]) :
                    arguments.put("params", [consentKey: issue.projectKey])
        } else {
            arguments.put("controller", "project")
            arguments.put("action", "main")
            arguments.put("projectKey", id)
            tab != null ? arguments.put("params", [projectKey: issue.projectKey, tab: tab]) :
                    arguments.put("params", [projectKey: issue.projectKey])
        }
        arguments
    }

    static boolean isConsentGroup(Issue issue) {
        return issue.type == IssueType.CONSENT_GROUP.name || issue.controller == IssueType.CONSENT_GROUP.name
    }

    static Map<String, Object> generateArgumentsForRedirect(IssueSearchItemDTO issue, String id, String tab) {
        Map<String, Object> arguments = new HashMap<>()
        if (isConsentGroup(issue)) {
            arguments.put("controller", "newConsentGroup")
            arguments.put("action", "main")
            tab != null ? arguments.put("params", [consentKey: issue.projectKey, tab: tab]) :
                    arguments.put("params", [consentKey: issue.projectKey])
        } else {
            arguments.put("controller", "project")
            arguments.put("action", "main")
            arguments.put("projectKey", id)
            tab != null ? arguments.put("params", [projectKey: issue.projectKey, tab: tab]) :
                    arguments.put("params", [projectKey: issue.projectKey])
        }
        arguments
    }

    static boolean isConsentGroup(IssueSearchItemDTO issue) {
        return issue.type == IssueType.CONSENT_GROUP.name
    }
}
