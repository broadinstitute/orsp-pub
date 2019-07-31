package org.broadinstitute.orsp.deploy

import groovy.util.logging.Slf4j
import groovyx.net.http.HttpBuilder

@Slf4j
class VaultSecrets {

    static Map<String, String> getParsedSecret(String token, String vaultAddress, String secretPath) {
        HttpBuilder http = HttpBuilder.configure {
            
            request.uri = "${vaultAddress}/v1/${secretPath}"
            request.headers['Content-Type'] = "application/json"
            request.headers['X-Vault-Token'] = token
        }
        http.get(Map){}.get("data")
    }

    static String getStringSecret(String token, String vaultAddress, String secretPath) {
        HttpBuilder http = HttpBuilder.configure {
            request.uri = "${vaultAddress}/v1/${secretPath}"
            request.headers['X-Vault-Token'] = token
        }
        http.get(String){
            response.success { resp, json ->
                json.data.value.toString()
            }
        }
    }

}
