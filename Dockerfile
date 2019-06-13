FROM redwolfgang20/grails as builder
COPY . /app
WORKDIR /app
# ARG VAULT_TOKEN
# ARG VAULT_ADDR
# ENV VAULT_TOKEN ${VAULT_TOKEN}
# ENV VAULT_ADDR ${VAULT_ADDR}

# RUN echo "VAULT_ADDR is $VAULT_ADDR"
# RUN echo "VAULT_TOKEN is $VAULT_TOKEN"

# RUN ./gradlew renderConfigs
RUN ./gradlew webpackProd
RUN grails -Dgrails.env=dev war

FROM openjdk:8-alpine
COPY --from=builder /app/build/libs/orsp.war /orsp
WORKDIR /orsp

EXPOSE 8080
EXPOSE 8443

CMD ["java", "-jar", "orsp.war"]
