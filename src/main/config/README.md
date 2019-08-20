# Rendering Cconfigurations

A full ConfigMap can be rendered with dsde-toolbox:

```
docker run -e ENVIRONMENT=dev -e LOG_LEVEL=debug -e VAULT_TOKEN=$(cat ~/.vault-token) -e INPUT_PATH=/working -e OUT_PATH=/working -v ${PWD}:/working broadinstitute/dsde-toolbox:consul-template-20-0.0.1 render-templates.sh
```

# Applying Cconfigurations
Set up your cluster context and then apply the rendered file:

```
kubectl config get-contexts
kubectl config use-context <full cluster name>
kubectl config set-context --current --namespace=orsp
kubectl apply -f configmap.yaml
```

# TODO
All of this should be part of an automated deploy process. It is described here for future 
automation work. See [BTRX-766](https://broadinstitute.atlassian.net/browse/BTRX-766) for more 
details.