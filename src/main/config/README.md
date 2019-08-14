Configmap can be rendered like this:

```
docker run -e ENVIRONMENT=dev -e NAME=orsp -e LOG_LEVEL=debug -e VAULT_TOKEN=$(cat ~/.vault-token) -e INPUT_PATH=/working -e OUT_PATH=/working -v ${PWD}:/working broadinstitute/dsde-toolbox:consul-template-20-0.0.1 render-templates.sh
```