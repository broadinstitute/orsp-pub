package org.broadinstitute.orsp

class IndexController {

    UserService userService

    def index() {
        render(view: "/index")
    }

    def about() {}

    def profile() {
        if (session["user"]) {
            User user = (User) session["user"]
            [user: user]
        } else {
            render(view: "/index")
        }
    }

}
