FROM node:14.15.4

WORKDIR /usr/src/app

ARG NODE_ENV
ENV NODE_ENV ${NODE_ENV}

COPY package.json ./

RUN npm install --silent

COPY . .

ENV PORT 8000
EXPOSE ${PORT}

ARG REDIS_HOST
ENV REDIS_HOST ${REDIS_HOST}

CMD [ "npm", "start" ]