package org.broadinstitute.orsp

import grails.converters.JSON
import grails.core.GrailsApplication
import grails.rest.Resource
import org.broadinstitute.orsp.consent.ConsentResource
import org.broadinstitute.orsp.utils.DataUseRestrictionParser


/**
 * Extend Base Controller with actions specific to Data Use Restrictions.
 */
@Resource
class DataUseController extends AuthenticatedController {

    GrailsApplication grailsApplication
    DataUseLetterService dataUseLetterService

    @Override
    def show() {
        render(view: "/mainContainer/index", model:[restrictionId: params.id])
    }

    // TODO: Move db logic to service
    @Override
    create() {
        Issue consent = queryService.findByKey(params.id)
        DataUseRestriction restriction = new DataUseRestriction()
        restriction.consentGroupKey = params.id
        restriction.consentPIName = params.principalInvestigatorName
        render(view: "edit", model: [consent: consent,
                                     restriction: restriction,
                                     create: params.create])
    }

    // TODO: Move db logic to service
    def edit() {
        DataUseRestriction restriction = DataUseRestriction.findById(params.id)
        Issue consent = queryService.findByKey(restriction.consentGroupKey)
        [restriction: restriction,
         consent    : consent,
         create     : params.create]
    }

    def save() {
        DataUseRestriction restriction = DataUseRestriction.findByConsentGroupKey(params.consentGroupKey)
        restriction = DataUseRestrictionParser.fromParams(restriction, params)
        restriction = dataUseLetterService.createSdul(restriction, getUser()?.displayName)
        if (params.create) {
            redirect(controller: 'newConsentGroup', action: "main", params: [consentKey: restriction.consentGroupKey, tab: 'documents'])
        } else {
            redirect(controller: 'dataUse', action: "show", params: [id: restriction.id])
        }
    }

}
