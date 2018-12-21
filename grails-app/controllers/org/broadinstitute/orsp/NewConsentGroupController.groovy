package org.broadinstitute.orsp

class NewConsentGroupController extends AuthenticatedController{
    def show() {
        println params.projectKey
        render(view: "/newConsentGroup/index")
    }
}
