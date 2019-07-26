package org.broadinstitute.orsp.deploy

@SuppressWarnings("GrMethodMayBeStatic")
class RenderTemplate {

    /**
     * Maintain the current consul template format of the `ctmpl` file if we ever need to use that utility.
     * Rip through the template, dropping the current ctmpl beginning and end tags. This does straight
     * string replacement of the ctmpl variables with secrets from vault.
     *
     * If the ctmpl file goes through changes, we should carefully track that here. For example, if we add more
     * header and end tags, we need to deal with it in the config text. Also, if we ever add consul branching
     * logic, this will fail.
     *
     * TODO: Is there a consul template (HCL) java library we can use? Maybe http://www.cfg4j.org/
     *
     * @param parsedSecrets
     * @param projectHome
     * @param local
     */
    static void renderApplicationYaml(Map<String, String> parsedSecrets, String projectHome, Boolean local) {
        // TODO: This should be an input
        String config = new File("${projectHome}/src/main/config/application.yml.ctmpl").
                readLines().
                drop(1).            // Drop the first line which sets up consul variables
                dropRight(1).       // Drop the last line which ends the consul variables
                join("\n")          // Turn it back into a string.
        // TODO: This should be an input
        new File("/etc/config/application.yml").withWriter { w ->
        //new File("${projectHome}/grails-app/conf/application.yml").withWriter { w ->
            parsedSecrets.each {
                config = config.replace('{{$orsp.Data.' + it.key + '}}', it.value)
                if (local) {
                    config = config.replace("sync: true", "sync: false")
                    config = config.replace("serverURL: https://orsp.broadinstitute.org", "serverURL: https://localhost:8443")
                }
            }
            w << config
        }
    }

}
