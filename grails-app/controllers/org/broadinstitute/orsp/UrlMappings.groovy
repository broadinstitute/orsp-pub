package org.broadinstitute.orsp

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        // TODO: Would prefer a better way to redirect a root url to a controller regardless of action.
        // Without the extra declarations, the default index action is always the one called even if /funding is hit.
        "/api/report"(controller: 'report', action: "index")
        "/api/report/funding"(controller: 'report', action: "funding")
        "/"(view:"/index")
        '/api/swagger/**'(controller: 'api', action: 'swagger')
        '/api/project'(resource: 'project')
        '/api/project/attach-document'(controller: 'project', action: 'attachDocument', method: 'POST')
        '/api/newConsentGroup'(resource: 'newConsentGroup')
        // Custom Error handlers.
        "500"(controller: "error", action: "error500")
        "404"(controller: "error", action: "error404")
        "403"(controller: "error", action: "error403")

        // Handle observed fishing attempts
        "/sdk"                          (controller: "error", action: "error403")
        "/Rapid7"                       (controller: "error", action: "error403")
        "/dyndata.js"                   (controller: "error", action: "error403")
        "/en/welcomeRes.js"             (controller: "error", action: "error403")
        "/console/login/LoginForm.jsp"  (controller: "error", action: "error403")
        "/.git**"                       (controller: "error", action: "error403")
        "/.svn**"                       (controller: "error", action: "error403")
        "/.hg**"                        (controller: "error", action: "error403")
        "/.bzr**"                       (controller: "error", action: "error403")
    }

}
