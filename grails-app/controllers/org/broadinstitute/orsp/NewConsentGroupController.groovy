package org.broadinstitute.orsp

import grails.converters.JSON

class NewConsentGroupController extends AuthenticatedController{
    def fileName = 'Broad_DUL_Draft-Cover_Letter_Form_Fillable.pdf'

    def show() {
        render(view: "/newConsentGroup/index")
    }

    def downloadFillablePDF () {
        try {
            def resource = this.class.classLoader.getResource(fileName)
            response.setHeader('Content-disposition', "attachment; ${fileName}")
            response.setHeader('Content-Length', 'file-size')
            response.setContentType('application/pdf')
            response.outputStream << resource.openStream()
        } catch (Exception e){
            response.status = 500
            render([error: "${e}"] as JSON)
        }
    }

}
