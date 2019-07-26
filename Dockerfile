FROM redwolfgang20/grails as builder
COPY . /app
WORKDIR /app

RUN ./gradlew webpackProd --stacktrace --debug
RUN grails -Dgrails.env=dev war

FROM openjdk:8-alpine
WORKDIR /
COPY --from=builder /app/build/libs/orsp.war .

EXPOSE 8080
EXPOSE 8443

CMD ["java", "-jar", "orsp.war", "--spring.config.location=classpath:/orsp-config,file:./orsp-config/"]

