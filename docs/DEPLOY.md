# Deployment

TODO:

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