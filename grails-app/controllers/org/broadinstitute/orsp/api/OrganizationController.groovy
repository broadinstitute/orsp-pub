package org.broadinstitute.orsp.api

import com.google.gson.JsonArray
import com.google.gson.JsonParser
import grails.converters.JSON
import grails.rest.Resource
import groovy.util.logging.Slf4j
import org.apache.commons.lang.StringUtils
import org.broadinstitute.orsp.*
import org.broadinstitute.orsp.utils.IssueUtils

import java.text.SimpleDateFormat

@Slf4j
@Resource
class OrganizationController extends AuthenticatedController {

    OrganizationService organizationService

    def getOrganizations() {
        try {
            List<Organization> organizations = organizationService.findAllOrganizations()
            render organizations as JSON
        } catch(Exception e) {
            handleException(e)
        }
    }

    def addOrganization() {
        Map<String, Object> organization = IssueUtils.getJson(Map.class, request.JSON)
        try {
            organizationService.createOrganization((String)organization.get("name") )
            response.status = 201
            render([message: 'Organization was created'] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

    def editOrganization() {
        Map<String, Object> organization = IssueUtils.getJson(Map.class, request.JSON)
        try {
            organizationService.editOrganization((Integer)organization.get("id"), (String)organization.get("name") )
            response.status = 200
            render([message: 'Organization was updated'] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

    def deleteOrganization() {
        try {
            organizationService.deleteOrganization((String)params.id)
            response.status = 200
            render([message: 'Organization was deleted'] as JSON)
        } catch(Exception e) {
            handleException(e)
        }
    }

}
