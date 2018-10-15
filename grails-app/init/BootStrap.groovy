
class BootStrap {

    def init = { servletContext ->
        System.setProperty("https.protocols", "TLSv1.2")
    }

    def destroy = {
    }

}
