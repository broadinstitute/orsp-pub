package org.broadinstitute.orsp

class NewConsentGroupController extends AuthenticatedController{
    def show() {
        render(view: "/newConsentGroup/index")
    }
}
