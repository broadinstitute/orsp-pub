# Deployment

TODO: Update for cloud deployment

Run the `deploy` gradle task to deploy to an environment. Defaults to dev environment
if not specified. Requires username and password to the current application host
as well as a vault url where configuration secrets are maintained. Requires an updated and
valid `.vault-token` file in the user's home directory.

```
gradle deploy --user=user --pass=pass -Dgrails.env=prod
```

Overridable options include:
* **-Dgrails.env**  *Optional.* The environment, dev if not provided.
* **host**          *Optional.* The application host (current host by default)
* **user**          *Required.* The tomcat manager username
* **pass**          *Required.* The tomcat manager password


## Render Configurations

Run the `renderConfigs` gradle task to generate fresh configuration files from 
current vault secrets. Can be run with an input argument `--local` for
configurations that are appropriate for a local instance, pointing to the dev 
database. The default is false, for dev/prod config generation.

Requires an environment variable to be set (or passed in via -D): 
* `VAULT_ADDR` that points to a vault secrets server.

Some additional reference material: 
* [Broad's Vault Instructions](https://broadinstitute.atlassian.net/wiki/spaces/DO/pages/113874856/Vault)
* [Hashicorp Vault Docs](https://www.vaultproject.io/docs/commands/login.html)
* [DSDE Toolbox Docs](https://hub.docker.com/r/broadinstitute/dsde-toolbox/)

If you see an error like this, it generally means you should re-authenticate with vault
```
* What went wrong:
Execution failed for task ':renderConfigs'.
> Forbidden
```
Authenticate (or see dsde-toolbox link for authenticating)
```
vault auth -method=github token=$(cat ~/.github-token)
```
