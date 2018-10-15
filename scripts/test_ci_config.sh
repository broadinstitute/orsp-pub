#!/bin/bash
set -euox pipefail
IFS=$'\n\t'

cp ${PWD}/src/main/config/application-test.yml ${PWD}/grails-app/conf/application.yml
cp ${PWD}/src/main/config/orsp-client-test.json ${PWD}/grails-app/conf/orsp-client.json