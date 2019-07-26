package org.broadinstitute.orsp

class IndexController {

    UserService userService

    def index() {
        render(view: "/index")
    }

    def about() {}

    def profile() {
        render(view: "/mainContainer/index")
    }

}
