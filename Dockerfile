FROM openjdk:8 as builder

RUN apt-get update

# Install npm and nodejs
RUN apt-get -qq -y install \
    curl \
    unzip \
    build-essential \
    libssl-dev \
    libpng-dev \
    zip

RUN mkdir /root/.nvm
ENV NVM_DIR /root/.nvm
ENV NODE_VERSION 10.16.0

RUN curl -o- https://raw.githubusercontent.com/creationix/nvm/v0.34.0/install.sh | bash
RUN chmod +x $HOME/.nvm/nvm.sh
RUN . $HOME/.nvm/nvm.sh && nvm install $NODE_VERSION && nvm alias default $NODE_VERSION && nvm use default && npm install -g npm 

RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/nodejs
RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/node /usr/bin/node
RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/npm /usr/bin/npm

RUN npm install -g webpack webpack-cli yarn 

RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/webpack /usr/bin/webpack
RUN ln -sf /root/.nvm/versions/node/v$NODE_VERSION/bin/webpack-cli /usr/bin/webpack-cli

#

RUN curl -s "https://get.sdkman.io" | bash
RUN chmod a+x "$HOME/.sdkman/bin/sdkman-init.sh"
RUN /bin/bash -c "source $HOME/.sdkman/bin/sdkman-init.sh"
RUN export SDKMAN_DIR="$HOME/.sdkman"
RUN /bin/bash -c "source $HOME/.sdkman/bin/sdkman-init.sh; sdk install grails 3.3.8"
RUN /bin/bash -c "source $HOME/.sdkman/bin/sdkman-init.sh; sdk install gradle 3.5"
RUN /bin/bash -c "source $HOME/.sdkman/bin/sdkman-init.sh; sdk install groovy 2.5.7"

COPY . /app
WORKDIR /app

RUN npm install 
RUN webpack --mode=development --config webpack.config.js

#RUN /bin/bash -c "source $HOME/.sdkman/bin/sdkman-init.sh; env; gradle webpackProd"

RUN /bin/bash -c "source $HOME/.sdkman/bin/sdkman-init.sh; grails -Dgrails.env=prod war"

FROM openjdk:8-alpine
WORKDIR /
COPY --from=builder /app/build/libs/orsp.war .

EXPOSE 8080
EXPOSE 8443

CMD ["java", "-jar", "orsp.war", "--spring.config.location=classpath:/orsp-config,file:./orsp-config/"]

