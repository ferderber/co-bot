FROM node:alpine

RUN mkdir -p /cobot

ADD ./package.json ./yarn.* /tmp/
ENV NODE_ENV=development
RUN apk add --no-cache --virtual .gyp python make g++ \
    && cd /tmp \
    && yarn \
    && apk del .gyp
RUN cd /cobot && ln -s /tmp/node_modules

COPY . /cobot

WORKDIR /cobot
RUN yarn build


ENV NODE_ENV=production

EXPOSE 3000
CMD ["yarn", "start"]