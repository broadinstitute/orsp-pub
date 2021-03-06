package org.broadinstitute.orsp

import grails.converters.JSON

/**
 * Interceptor specific to API access related to the Read Only admin role
 *
 * Requires not to be ro_admin role to proceed
 */
class ReadOnlyInterceptor implements UserInfo {

    ReadOnlyInterceptor() {
        // Controllers under API folder
        match controller: 'clarification', action: 'addClarificationRequest'
        match controller: 'dulNotify', action: 'sendNotifications'
        match controller: 'fileHelper', action: ~/(attachDocument|rejectDocument|approveDocument|updateDocumentsVersion|deleteDocument)/
        match controller: 'issueReview', action: ~/(save|update|delete)/
        match controller: 'newConsentGroup', action: ~/(save|approveConsentGroup|delete|update)/
        match controller: 'project', action: ~/(save|modifyExtraProperties|delete|update|updateAdminOnlyProps|handleIntake)/
        match controller: 'sampleConsentLink', action: 'save'
        // Controllers
        match controller: 'consentGroup', action: ~/(create|createAndLink|link|breakLink|unLink|unLinkConsentCollection|deleteCollectionLinks|edit|attachDocument|saveRestriction|attachConsentDocument)/
        match controller: 'dataUse', action: ~/(create|edit|save|exportConsent)/
        match controller: 'irb', action: ~/(handleIntake|create|edit|attachDocument|appModify|supportModify|supportAccept|appSubmit|supportSubmit|appAccept|appSigned|irbApprove|irbRequestMod)/
        match controller: 'ne', action: ~/(handleIntake|create|edit|attachDocument|submit|modify|accept|signed)/
        match controller: 'nhsr', action: ~/(create|edit|signed)/
        match controller: 'submission', action: ~/(save|delete|addFile|removeFile)/
        match controller: 'user', action: ~/(editOrspUserRole)/
    }

    boolean before() {
        if (isViewer()) {
            log.info 'Access denied. User has Read Only role.'
            forbidden()
            return false
        }
        true
    }

    def forbidden() {
        response.status = 403
        render([error: 'access denied'] as JSON)
    }

    def exception(Exception e) {
        response.status = 500
        render([error: e.message] as JSON)
    }
}
