package orsp

import grails.boot.GrailsApp
import grails.boot.config.GrailsAutoConfiguration

class Application extends GrailsAutoConfiguration {

//    @Override
//    Closure doWithSpring() {
//        def beans = {
//            multipartResolver(OrspMultipartResolver) {}
//        }
//        return beans
//    }

    static void main(String[] args) {
        GrailsApp.run(Application, args)
    }
}