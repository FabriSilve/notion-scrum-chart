FROM node:18

RUN npm install -g npm@9
RUN npm install -g vite@latest


USER node

RUN mkdir /home/node/code
RUN mkdir /home/node/code/node_modules
WORKDIR /home/node/code
COPY --chown=node ./package.json /home/node/code/package.json
COPY --chown=node ./package-lock.json /home/node/code/package-lock.json

COPY src /home/node/code/src

RUN npm install
