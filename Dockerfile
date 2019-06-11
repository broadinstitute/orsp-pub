
FROM redwolfgang20/grails as builder

COPY . /app
WORKDIR /app
RUN grails -Dgrails.env=dev war

FROM tomcat:latest 
WORKDIR /usr/local/tomcat
COPY --from=builder /app/tomcat-users.xml    /usr/local/tomcat/conf/tomcat-users.xml
COPY --from=builder /app/context.xml         /usr/local/tomcat/conf/context.xml
COPY --from=builder /app/server.xml          /usr/local/tomcat/conf/server.xml
# COPY --from=builder /app/certs/server.crt    /usr/local/tomcat/conf/server.crt
# COPY --from=builder /app/certs/server.key    /usr/local/tomcat/conf/server.key
COPY --from=builder /app/build/libs/orsp.war /usr/local/tomcat/webapps

EXPOSE 8080
EXPOSE 8443
