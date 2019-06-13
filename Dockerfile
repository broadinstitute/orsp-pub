FROM redwolfgang20/grails as builder
COPY . /app
WORKDIR /app

RUN ./gradlew webpackProd
RUN grails -Dgrails.env=dev war

FROM openjdk:8-alpine
WORKDIR /orsp
COPY --from=builder /app/build/libs/orsp.war .

EXPOSE 8080
EXPOSE 8443

CMD ["java", "-jar", "orsp.war"]
