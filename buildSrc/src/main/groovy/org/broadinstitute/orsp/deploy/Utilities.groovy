package org.broadinstitute.orsp.deploy

import groovy.util.logging.Slf4j

@Slf4j
class Utilities {

    static void executeLine(String line) {
        log.info("Executing: '${line}'")
        Process proc = line.execute()
        proc.waitFor()
        if (proc.exitValue() > 0) {
            String error = "Failure: ${proc.err.text}"
            log.error(error)
            throw new RuntimeException(error)
        }
        log.info("${proc.text}Completed")
    }

    static String getExecutionResult(String line) {
        log.info("Executing: '${line}'")
        Process proc = line.execute()
        proc.waitFor()
        if (proc.exitValue() > 0) {
            String error = "Failure: ${proc.err.text}"
            log.error(error)
            throw new RuntimeException(error)
        }
        log.info("${proc.text}Completed")
        proc.text.trim()
    }

}
