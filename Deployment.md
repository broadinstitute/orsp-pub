# ORSP Cloud Deployment 
This document explains how current ORSP cloud deployment is configured and the artifacts and steps required. 

Notes: 
- this document is assuming you already know about gcloud and kubectl commands and have them already installed in your computer. You can find related documentation at https://cloud.google.com/sdk/ and https://cloud.google.com/kubernetes-engine/docs/quickstart. 
- Some examples uses files in JSON format while the standard and recommended format is YAML and will be replced with YAML equivalent files in future versions.

### Prerequisites
To deploye ORSP on Google Kubernetes Engine (GKE), some previous work must be done :  

- mysql database must be available and accesible. We will be using a Cloud Sql instance, accesible through sqlproxy approach. Probably could be easier to use a private IP but since we lack of enough permissions to do so, sqlproxy will be. Detailed step may be included in future versions of this doc but meanwhile you can find documentation at https://cloud.google.com/sql/docs/mysql/connect-kubernetes-engine.

- Credentials to access Cloud Sql instance are stored as GKE Secrets and will be injected to the containers when appropriated. Please refer to https://cloud.google.com/kubernetes-engine/docs/concepts/secret for more information.

- an static IP is required. We will be using an IP provided by Google. For instance, we generated an static IP using the following command:  
  ```sh
  $ gcloud compute addresses describe orsp-pub-dev-ip --global 
  ```
- a domain name is required. We only have access to dsp-orsp-dev DNS Zone in Cloud DNS, so we create an A Record with DNS Name : ui.dsp-orsp-dev.broadinstitute.org and IP set to orsp-pub-dev-ip obtained in previous step. This domain name will be used to create an Ingress Load Balancer, the public entry point to the deployed application. 

- In order to provide SSL (TLS) access to application, a must, we need to get proper certificates for the domain name to be used. In ur case, we got a wildcard certificate for wildcard.dsp-orsp-dev.broadinstitute.org . Certificate is stored as a Secret in GKE. Please refer to https://cloud.google.com/kubernetes-engine/docs/concepts/secret for more information.  

- ORSP specific configuration files, formerly grails-app/conf/application.yml and grails/conf/orsp-client.json, must be stored as ConfigMap in GKE. At runtime, those configuration files will be mounted to the container. This separate step si rerquired since circleci can't access to Vault secrets and configuration files depends on Vault secrets. The renderConfig step of gradle buidl on ORSP is expected to be fullfilled by on-premises Jenkins. Please refer to https://cloud.google.com/kubernetes-engine/docs/concepts/configmap for more information.

### Overview

A deployment consist on :

- a GKE Cluster: GKE Clusters could be created using gcloud (command line) or Google GKE Console. from command line, you can create a cluster with 
   ```sh
  gcloud container clusters create myCluster
   ```
  In general, creating a cluster should be a one time comnmand, it is not required to create a cluster on every deployment. Please refer to https://cloud.google.com/kubernetes-engine/ for more info on GKE.

- a GKE Workload: a GKE workload is the actual deployment, is where our application lives and what will be updated or recreated on every deployment. As usual, you can create a workload or deployment from command line or GKE Console. For instance, command line looks line :
   ```sh
  kubectl apply -f deploy.json
   ```
   where deploy.json is :
   ```json
  {
  "apiVersion": "extensions/v1beta1",
  "kind": "Deployment",
  "metadata": {
    "annotations": {},
    "labels": {
      "app": "orsp-pub"
    },
    "name": "orsp-pub",
    "namespace": "default"
  },
  "spec": {
    "replicas": 1,
    "selector": {
      "matchLabels": {
        "app": "orsp-pub"
      }
    },
    "template": {
      "metadata": {
        "labels": {
          "app": "orsp-pub"
        }
      },
      "spec": {
        "containers": [
          {
            "env": [
              {
                "name": "MYSQL_DB_HOST",
                "value": "127.0.0.1:3306"
              },
              {
                "name": "MYSQL_DB_USERNAME",
                "valueFrom": {
                  "secretKeyRef": {
                    "key": "username",
                    "name": "cloudsql-db-credentials"
                  }
                }
              },
              {
                "name": "MYSQL_DB_PASSWORD",
                "valueFrom": {
                  "secretKeyRef": {
                    "key": "password",
                    "name": "cloudsql-db-credentials"
                  }
                }
              }
            ],
            "image": "gcr.io/orsp-dev/orsp-pub@sha256:390f72bbdd13a38f3fcb9b957538060c55662f34d4569508d5c7688871daafcd",
            "imagePullPolicy": "Always",
            "name": "orsp-pub",
            "ports": [
              {
                "containerPort": 8080
              }
            ],
            "volumeMounts": [
              {
                "mountPath": "/orsp-config",
                "name": "orsp-config"
              }
            ]
          },
          {
            "command": [
              "/cloud_sql_proxy",
              "-instances=orsp-dev:us-east1:bricc-mysql-dev=tcp:3306",
              "-credential_file=/secrets/cloudsql/credentials.json"
            ],
            "image": "gcr.io/cloudsql-docker/gce-proxy:1.12",
            "name": "cloudsql-proxy",
            "securityContext": {
              "allowPrivilegeEscalation": false,
              "runAsUser": 2
            },
            "volumeMounts": [
              {
                "mountPath": "/secrets/cloudsql",
                "name": "cloudsql-instance-credentials",
                "readOnly": true
              }
            ]
          }
        ],
        "dnsPolicy": "ClusterFirst",
        "restartPolicy": "Always",
        "schedulerName": "default-scheduler",
        "securityContext": {},
        "terminationGracePeriodSeconds": 30,
        "volumes": [
          {
            "name": "cloudsql-instance-credentials",
            "secret": {
              "secretName": "cloudsql-instance-credentials"
            }
          },
          {
            "configMap": {
              "name": "orsp-config-dev"
            },
            "name": "orsp-config"
          }
        ]
      }
    }
  }
  }
   ```
  Explanation of JSON file : TBD
  Please refer to https://cloud.google.com/kubernetes-engine/docs/how-to/deploying-workloads-overview gcloud container clusters create myCluster for more info on GKLE Workload.

- a GKE Service: in order to expose a group os nodes or pods running an application as a single resource, a GKE Service is required. A command line example is :
``` sh
  kubectl apply -f deploy.json
```
  where orsp-pub-service.json is : 
```json
  {
    "apiVersion": "v1",
    "kind": "Service",
    "metadata": {
      "annotations": {},
      "labels": {
        "app": "orsp-pub"
      },
      "name": "orsp-pub-service",
      "namespace": "default"
    },
    "spec": {
      "ports": [
        {
          "name": "http",
          "port": 80,
          "protocol": "TCP",
          "targetPort": 8080
        }
      ],
      "selector": {
        "app": "orsp-pub"
      },
      "sessionAffinity": "None",
      "type": "NodePort"
    }
  }

```

  Please refere to https://cloud.google.com/kubernetes-engine/docs/concepts/service for more info on GKE Services. 

. an Ingres Load Balancer

```sh
  kubectl apply -f orsp-pub-ingresss.json
```
where orsp-pub-ingress.json is :
```json
  {
    "apiVersion": "extensions/v1beta1",
    "kind": "Ingress",
    "metadata": {
      "annotations": {
        "kubernetes.io/ingress.global-static-ip-name": "orsp-pub-dev-ip"
      },
      "labels": {
        "app": "orsp-pub"
      },
      "name": "orsp-pub-ingress",
      "namespace": "default"
    },
    "spec": {
      "backend": {
        "serviceName": "orsp-pub-service",
        "servicePort": "http"
      },
      "rules": [
        {
          "host": "ui.dsp-orsp-dev.broadinstitute.org",
          "http": {
            "paths": [
              {
                "backend": {
                  "serviceName": "orsp-pub-service",
                  "servicePort": "http"
                }
              }
            ]
          }
        }
      ],
      "tls": [
        {
          "hosts": [
            "ui.dsp-orsp-dev.broadinstitute.org"
          ],
          "secretName": "wildcard.dsp-orsp-dev.broadinstitute.org"
        }
      ]
    }
  }

```
  Please refer to https://cloud.google.com/kubernetes-engine/docs/concepts/ingress for more information about GKE Ingress Load Balancer.

## CircleCI
We are using CircleCI to automate some of the previpus steps. To do so, ORSP repo includes a .circleci folder with a config.yml file inside. That file is the script circleci runs on every commit. 

```yml
version: 2.1

executors:
  cloud-sdk:
    docker:
      - image: google/cloud-sdk
commands:
  build-env:
    description: "Build/push image to GCR"
    parameters:
      sa_key_name:
        type: string
        default: "GCLOUD_ORSP_DEV"
      env:
        type: string
        default: "dev"
      repo_name:
        type: string
        default: ${CIRCLE_PROJECT_REPONAME}
      repo_branch:
        type: string
        default: ${CIRCLE_BRANCH}
      google_project:
        type: string
        default: "orsp-dev"
    steps:
      - run:
          name: Export env vars for substitution. $BASH_ENV is sourced before each step
          command: |
            echo 'export COMMIT="`git rev-parse --short HEAD`"' >> $BASH_ENV
            echo 'export ENV="<< parameters.env >>"' >> $BASH_ENV
            echo 'export REPO_NAME="<< parameters.repo_name >>"' >> $BASH_ENV
            echo 'export REPO_BRANCH="<< parameters.repo_branch >>"' >> $BASH_ENV
            echo 'export GOOGLE_PROJECT="<< parameters.google_project >>"' >> $BASH_ENV
            source $BASH_ENV
      - run:
          name: Setup Google Cloud SDK
          command: |
            apt-get install -qq -y gettext
            echo "$<< parameters.sa_key_name >>" > ${HOME}/gcloud-service-key.json
            gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
            gcloud --quiet config set project ${GOOGLE_PROJECT}
      - setup_remote_docker:
          docker_layer_caching: true
      - run:
          name: Docker build/push to GCR
          command: |
            docker build -t ${REPO_NAME} .
            docker tag ${REPO_NAME} gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:${COMMIT}
            gcloud auth print-access-token | docker login -u oauth2accesstoken --password-stdin https://gcr.io
            docker push gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:${COMMIT}
            gcloud container images add-tag gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:${COMMIT} gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:${ENV} -q
            gcloud container images add-tag gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:${COMMIT} gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:latest -q
  deploy-env:
    description: "Deploy commit to GCR"
    parameters:
      sa_key_name:
        type: string
        default: "GCLOUD_ORSP_DEV"
      env:
        type: string
        default: "dev"
      namespace:
        type: string
        default: "default"
      repo_name:
        type: string
        default: "orsp-pub"
      google_project:
        type: string
        default: "orsp-dev"
      google_zone:
        type: string
        default: "us-central1-a"
      google_cluster:
        type: string
        default: "orsp-dev-cluster"
      commit:
        type: string
        default: ""
    steps:
      - run:
          name: Export env vars for substitution. $BASH_ENV is sourced before each step
          command: |
            echo 'export NAMESPACE="<< parameters.namespace >>"' >> $BASH_ENV
            echo 'export REPO_NAME="<< parameters.repo_name >>"' >> $BASH_ENV
            echo 'export GOOGLE_PROJECT="<< parameters.google_project >>"' >> $BASH_ENV
            echo 'export GOOGLE_ZONE="<< parameters.google_zone >>"' >> $BASH_ENV
            echo 'export GOOGLE_CLUSTER="<< parameters.google_cluster >>"' >> $BASH_ENV
            source $BASH_ENV
      - run:
          name: Setup Google Cloud SDK
          command: |
            apt-get install -qq -y gettext
            echo "$<< parameters.sa_key_name >>" > ${HOME}/gcloud-service-key.json
            gcloud auth activate-service-account --key-file=${HOME}/gcloud-service-key.json
            gcloud --quiet config set project ${GOOGLE_PROJECT}
            gcloud --quiet config set compute/zone ${GOOGLE_ZONE}
            gcloud --quiet container clusters get-credentials ${GOOGLE_CLUSTER}
      - run:
          name: Deploy to Kubernetes
          command: |
            envsubst < ${HOME}/project/conf/k8s.yml > ${HOME}/patched_k8s.yml
            envsubst < ${HOME}/project/conf/service.yaml > ${HOME}/patched_service.yml
            envsubst < ${HOME}/project/conf/ingress.yaml > ${HOME}/patched_ingress.yml
            cat ${HOME}/patched_k8s.yml
            kubectl config set-context --current --namespace=${NAMESPACE}
            kubectl apply -f ${HOME}/patched_k8s.yml
            kubectl apply -f ${HOME}/patched_service.yml
            kubectl apply -f ${HOME}/patched_ingress.yml
            kubectl rollout status deployment/${REPO_NAME}

jobs:
  deploy-dev:
    executor: cloud-sdk
    steps:
      - checkout
      - build-env:
          sa_key_name: "GCLOUD_ORSP_DEV"
          env: "dev"
          repo_name: "orsp-pub"
          google_project: "orsp-dev"
      - deploy-env:
          sa_key_name: "GCLOUD_ORSP_DEV"
          env: "dev"
          namespace: "default"
          repo_name: "orsp-pub"
          google_project: "orsp-dev"
          google_zone: "us-central1-a"
          google_cluster: "orsp-dev-cluster"
          commit: ${COMMIT}

workflows:
  version: 2
  build-deploy:
    jobs:
      - deploy-dev:
          filters:
            branches:
              only: BTRX-666-dgil
```


  As you see, the file defines a workflow template and includes a lot of variables and parameters resolution to generate a patched (configured) version of another repo file . conf/k8s.yml, conf/service.ym y conf/ingress.yml. In fact, service.yml and ingress.yml are not required on each build and may be removed in the future. 
  Once the variables are replaced with generated values, scripts are run to make the actual deplopymen, service and ingress.
  
  ### k8s.yml
  ```yml
  apiVersion: extensions/v1beta1
kind: Deployment
metadata:
  annotations: {}
  labels:
    app: ${REPO_NAME}
  name: ${REPO_NAME}
  namespace: ${NAMESPACE}
spec:
  replicas: 1
  selector:
    matchLabels:
      app: ${REPO_NAME}
  template:
    metadata:
      labels:
        app: ${REPO_NAME}
    spec:
      containers:
      - env:
        - name: MYSQL_DB_HOST
          value: 127.0.0.1:3306
        - name: MYSQL_DB_USERNAME
          valueFrom:
            secretKeyRef:
              key: username
              name: cloudsql-db-credentials
        - name: MYSQL_DB_PASSWORD
          valueFrom:
            secretKeyRef:
              key: password
              name: cloudsql-db-credentials
        image: gcr.io/${GOOGLE_PROJECT}/${REPO_NAME}:${COMMIT}
        imagePullPolicy: Always
        name: ${REPO_NAME}
        ports:
        - containerPort: 8080
        volumeMounts:
        - mountPath: "/orsp-config"
          name: orsp-config
      - command:
        - "/cloud_sql_proxy"
        - "-instances=orsp-dev:us-east1:bricc-mysql-dev=tcp:3306"
        - "-credential_file=/secrets/cloudsql/credentials.json"
        image: gcr.io/cloudsql-docker/gce-proxy:1.12
        name: cloudsql-proxy
        securityContext:
          allowPrivilegeEscalation: false
          runAsUser: 2
        volumeMounts:
        - mountPath: /secrets/cloudsql
          name: cloudsql-instance-credentials
          readOnly: true
      dnsPolicy: ClusterFirst
      restartPolicy: Always
      schedulerName: default-scheduler
      securityContext: {}
      terminationGracePeriodSeconds: 30
      volumes:
      - name: cloudsql-instance-credentials
        secret:
          secretName: cloudsql-instance-credentials
      - configMap:
          name: orsp-config-dev
        name: orsp-config

  ```
  
 ### service.yaml
  ```yml
  apiVersion: v1
kind: Service
metadata:
  annotations: {}
  labels:
    app: ${REPO_NAME}
  name: ${REPO_NAME}-service
  namespace: default
spec:
  ports:
  - name: http
    port: 80
    protocol: TCP
    targetPort: 8080
  selector:
    app: ${REPO_NAME}
  sessionAffinity: None
  type: NodePort
  ```
  
### ingress.yaml  
  ```yml
  apiVersion: extensions/v1beta1
kind: Ingress
metadata:
  annotations:
    kubernetes.io/ingress.global-static-ip-name: orsp-pub-dev-ip
  labels:
    app: ${REPO_NAME}
  name: ${REPO_NAME}-ingress
  namespace: default
spec:
  backend:
    serviceName: ${REPO_NAME}-service
    servicePort: http
  rules:
  - host: ui.dsp-orsp-dev.broadinstitute.org
    http:
      paths:
      - backend:
          serviceName: ${REPO_NAME}-service
          servicePort: http
  tls:
  - hosts:
    - ui.dsp-orsp-dev.broadinstitute.org
    secretName: wildcard.dsp-orsp-dev.broadinstitute.org
  ```
  
  
  
  