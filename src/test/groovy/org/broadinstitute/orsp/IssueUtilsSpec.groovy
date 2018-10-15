package org.broadinstitute.orsp

import grails.web.servlet.mvc.GrailsParameterMap
import org.broadinstitute.orsp.utils.IssueUtils
import spock.lang.Specification

class IssueUtilsSpec extends Specification {

    void "Test get controller from name"() {
        expect:
        IssueUtils.getControllerForIssueTypeName(IssueType.IRB.name) == IssueType.IRB.controller
        IssueUtils.getControllerForIssueTypeName(IssueType.NHSR.name) == IssueType.NHSR.controller
        IssueUtils.getControllerForIssueTypeName(IssueType.NE.name) == IssueType.NE.controller
        IssueUtils.getControllerForIssueTypeName(IssueType.CONSENT_GROUP.name) == IssueType.CONSENT_GROUP.controller
    }

    void "Test converting nested parameters to a list of properties: single valued map"() {
        given:
        Map propMap = new HashMap()
        propMap.put("source", "Federal")
        propMap.put("id", "1015")
        propMap.put("name", "test1")
        propMap.put("award", "a1")
        GrailsParameterMap params = new GrailsParameterMap(propMap, null)

        when:
        List<Map<String, Object>> convertedMap = IssueUtils.convertNestedParamsToPropertyList(params)

        then:
        convertedMap.size() == 1
    }

    void "Test converting nested parameters to a list of properties: multi-valued map"() {
        given:
        Map propMap = new HashMap()
        propMap.put("source", ["Federal Prime", "Federal Prime"])
        propMap.put("id", ["1015", "0"])
        propMap.put("name", ["name", "name 2"])
        propMap.put("award", ["number", "number 2"])
        GrailsParameterMap params = new GrailsParameterMap(propMap, null)

        when:
        List<Map<String, Object>> convertedMap = IssueUtils.convertNestedParamsToPropertyList(params)

        then:
        convertedMap.size() == 2
    }

}
