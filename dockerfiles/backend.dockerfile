FROM node:lts-alpine

ENV NODE_ENV=production

# Acess to privileged ports <1024 to non-root user
RUN apk add --no-cache libcap
RUN setcap 'cap_net_bind_service=+ep' `readlink -f \`which node\``

RUN mkdir -p /home/node/api/node_modules && mkdir -p /home/node/tmp/uploads && chown -R node:node /home/node/api
WORKDIR /home/node/api

COPY package.json yarn.* ./
USER node
RUN yarn

COPY --chown=node:node ./dist/ .

RUN echo "never > /sys/kernel/mm/transparent_hugepage/enabled"

EXPOSE 80

CMD ["node", "server.js"]
