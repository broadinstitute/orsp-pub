package org.broadinstitute.orsp

import grails.async.Promise
import grails.async.PromiseList
import groovy.transform.CompileStatic
import groovy.util.logging.Slf4j

import java.util.concurrent.ExecutionException
import java.util.concurrent.TimeUnit
import java.util.concurrent.TimeoutException

/**
 * Utility class to better log exceptions arising inside promises.
 * Copied from https://medium.com/@acetrike/grails-3-async-the-good-the-bad-the-ugly-8773a151cfce
 */

@Slf4j
@CompileStatic
class PromiseUtil {

    static <T> T promisesGet(PromiseList<T> promises, String promiseName = '', int timeoutInSeconds = 60) {
        T result = null
        try {
            result = promises.get(timeoutInSeconds, TimeUnit.SECONDS) as T
        } catch (InterruptedException ignored) {
            log.error "Promise - current thread was interrupted while waiting for result: " + promiseName
        } catch (ExecutionException ignored) {
            log.error "Promise - current thread threw an exception during computation: " + promiseName
        } catch (TimeoutException ignored) {
            log.error "Promise - current thread timed out while waiting for result: " + promiseName
        }
        result
    }

}
