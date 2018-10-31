package org.broadinstitute.orsp

import grails.artefact.controller.support.ResponseRenderer
import groovy.util.logging.Slf4j
import org.broadinstitute.orsp.config.AppInfoConfiguration
import org.parboiled.common.FileUtils

import javax.servlet.http.HttpServletRequest

@Slf4j
class SwaggerService implements ResponseRenderer {

    AppInfoConfiguration appInfoConfiguration

    // Note, this needs to be kept in sync with the version in build.gradle. boo.
    private final static String swaggerResource = 'META-INF/resources/webjars/swagger-ui/2.2.10-1'

    def handleRequest(HttpServletRequest request) {
        // This logic gets the relative path to be processed. If none, serve the index
        String path = request.getRequestURI()
        path = path - request.contextPath
        path = path - "/api"
        path = path - "/swagger"
        String mediaType = getMediaTypeFromPath(path)
        if (path.isEmpty() || path.endsWith('index.html') || path.endsWith('/')) {
            render (text: getIndexContent(request), contentType: mediaType, encoding: 'UTF-8')
        } else {
            if (path.endsWith('png') || path.endsWith('gif') || path.endsWith('ico')) {
                byte[] bytes = FileUtils.readAllBytesFromResource(swaggerResource + path)
                render(text: bytes, contentType: mediaType)
            } else if (path.endsWith('api.yaml')) {
                String content = FileUtils.readAllTextFromResource('api.yaml').
                        replace('${contextPath}'.toString(), request.contextPath).
                        replace('${appVersion}', appInfoConfiguration.getVersion())
                render (text: content, contentType: mediaType, encoding: 'UTF-8')
            } else {
                String content = FileUtils.readAllTextFromResource(swaggerResource + path)
                render (text: content, contentType: mediaType, encoding: 'UTF-8')
            }
        }
    }

    private static String getIndexContent(HttpServletRequest request) {
        String content = FileUtils.readAllTextFromResource(swaggerResource + '/index.html')
        String newContextPath = "${request.contextPath}/api/swagger"
        return content
        // Stuff we don't need:
                .replace('<link rel="icon" type="image/png" href="images/favicon-32x32.png" sizes="32x32" />', '')
                .replace('<link rel="icon" type="image/png" href="images/favicon-16x16.png" sizes="16x16" />', '')
                .replace('<img class="logo__img" alt="swagger" height="30" width="30" src="images/logo_small.png" />', '')
        // Stuff we do need:
                .replace('http://petstore.swagger.io/v2/swagger.json', "${newContextPath}/api.yaml")
                .replaceAll("href=\"http://swagger.io\"", "href=\"${request.contextPath}\"")
        // Rewriting all linked resources so they will be rendered through this controller.
                .replaceAll("href='css", "href='${newContextPath}/css")
                .replaceAll("href='images", "href='${newContextPath}/images")
                .replaceAll("src=\"images", "src=\"${newContextPath}/images")
                .replaceAll("src='lib", "src='${newContextPath}/lib")
                .replaceAll("src='swagger-ui.js", "src='${newContextPath}/swagger-ui.js")
    }

    private static String getMediaTypeFromPath(String path) {
        // Handle specific cases for the various swagger ui file content types:
        def result
        switch (path) {
            case {path.endsWith('yaml') || path.endsWith('map')}:
                result = 'text/plain'
                break
            case {path.endsWith('css')}:
                result = 'text/css'
                break
            case {path.endsWith('js')}:
                result = 'application/js'
                break
            case {path.endsWith('png')}:
                result = 'image/png'
                break
            case {path.endsWith('gif')}:
                result = 'image/gif'
                break
            case {path.endsWith('ico')}:
                result = 'image/x-icon'
                break
            default:
                result = 'text/html'
                break
        }
        result
    }

}
