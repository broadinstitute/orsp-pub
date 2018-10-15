package org.broadinstitute.orsp.deploy

import org.gradle.api.DefaultTask
import org.gradle.api.internal.tasks.options.Option
import org.gradle.api.tasks.TaskAction

@SuppressWarnings("unused")
class RenderConfigs extends DefaultTask {

    boolean local = false
    @Option(option = 'local', description = 'Generate configurations for running application locally')
    void setLocalConfig(boolean localConfig) { this.local = localConfig }

    String projectHome
    String vault

    @TaskAction
    void render() {
        // TODO: This should be an input
        String userHome = System.properties['user.home']

        String vaultToken = new File("${userHome}/.vault-token").text

        // TODO: Look into making the secrets inputs. application.yml needs parsing, orsp-client.json just needs writing
        println("Rendering application.yml file from vault secrets")
        Map<String, String> parsedSecrets = VaultSecrets.getParsedSecret(vaultToken, vault, "secret/dsde/orsp/all/application.yml")
        RenderTemplate.renderApplicationYaml(parsedSecrets, projectHome, local)

        println("Rendering orsp-client.json file from vault secrets")
        String orspClientText = VaultSecrets.getStringSecret(vaultToken, vault, "secret/dsde/orsp/all/compliance-storage.json")
        new File("${projectHome}/grails-app/conf/orsp-client.json").withWriter { w ->
            w << orspClientText
        }
    }

}
