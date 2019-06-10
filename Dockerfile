FROM openjdk:8 as builder
COPY . /app

WORKDIR /app
ENV VAULT_ADDR https://clotho.broadinstitute.org:8200

RUN ./gradlew renderConfigs
RUN ./gradlew webpackProd
RUN grails -Dgrails.env=dev war

FROM tomcat:latest 
WORKDIR /usr/local/tomcat
COPY tomcat-users.xml    /usr/local/tomcat/conf/tomcat-users.xml
COPY context.xml         /usr/local/tomcat/conf/context.xml
COPY server.xml          /usr/local/tomcat/conf/server.xml
COPY certs/server.crt    /usr/local/tomcat/conf/server.crt
COPY certs/server.key    /usr/local/tomcat/conf/server.key
COPY --from=builder build/libs/orsp.war /usr/local/tomcat/webapps

EXPOSE 8080
EXPOSE 8443
