package org.broadinstitute.orsp.deploy

import org.gradle.api.DefaultTask
import org.gradle.api.internal.tasks.options.Option
import org.gradle.api.tasks.TaskAction

@SuppressWarnings("unused")
class RenderConfigs extends DefaultTask {

    boolean local = false
    @Option(option = 'local', description = 'Generate configurations for running application locally')
    void setLocalConfig(boolean localConfig) { this.local = localConfig }

    public String projectHome
    String vaultAddr

    @TaskAction
    void render() {

        String vaultToken = System.getenv("VAULT_TOKEN").replace("\n", "").replace("\r", "");
        String vaultAddr = System.getenv("VAULT_ADDR").replace("\n", "").replace("\r", "");

        // TODO: This should be an input
        String userHome = System.properties['user.home']

        String vaultToken = new File("${userHome}/.vault-token").text

        // TODO: Look into making the secrets inputs. application.yml needs parsing, orsp-client.json just needs writing
        Map<String, String> parsedSecrets = VaultSecrets.getParsedSecret(vaultToken, vaultAddr, "secret/dsde/orsp/all/application.yml")
        RenderTemplate.renderApplicationYaml(parsedSecrets, projectHome, local)

        println("Rendering orsp-client.json file from vaultAddr secrets")
        String orspClientText = VaultSecrets.getStringSecret(vaultToken, vaultAddr, "secret/dsde/orsp/all/compliance-storage.json")
        String orspClientText = VaultSecrets.getStringSecret(vaultToken, vaultAddr, "secret/dsde/orsp/all/compliance-storage.json")
        new File("/etc/config/orsp-client.json").withWriter { w ->	
            w << orspClientText
        }
    }

}
