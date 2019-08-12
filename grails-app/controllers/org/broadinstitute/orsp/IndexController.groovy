package org.broadinstitute.orsp

class IndexController {

    UserService userService

    def index() {
        render(view: "/index")
    }

    def about() {
        render(view: "/mainContainer/index")
    }

    def profile() {
        render(view: "/mainContainer/index")
    }

}
