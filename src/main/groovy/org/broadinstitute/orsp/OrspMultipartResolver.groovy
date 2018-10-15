package org.broadinstitute.orsp

import groovy.util.logging.Slf4j
import org.springframework.util.LinkedMultiValueMap
import org.springframework.web.multipart.MultipartException
import org.springframework.web.multipart.MultipartFile
import org.springframework.web.multipart.MultipartHttpServletRequest
import org.springframework.web.multipart.commons.CommonsMultipartResolver
import org.springframework.web.multipart.support.DefaultMultipartHttpServletRequest

import javax.servlet.http.HttpServletRequest

// TODO: Need to fix this for ticket https://broadinstitute.atlassian.net/browse/DSDECOM-116
@Slf4j
class OrspMultipartResolver extends CommonsMultipartResolver {

    static final String FILE_SIZE_EXCEEDED_ERROR = "fileSizeExceeded";

    MultipartHttpServletRequest resolveMultipart(HttpServletRequest request) {
        try {
            return super.resolveMultipart(request)
        } catch (MultipartException e) {
            log.error(e.getMessage())
            request.setAttribute(FILE_SIZE_EXCEEDED_ERROR, true)
            return new DefaultMultipartHttpServletRequest(request, new LinkedMultiValueMap<String, MultipartFile>(), new LinkedHashMap<String, String[]>(), new LinkedHashMap<String, String>())
        }
    }

}
