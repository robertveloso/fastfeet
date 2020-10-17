# Stage 1 - the build process
FROM node:14-alpine as build

WORKDIR /app

ENV PROD=true
ENV PORT 80
#ENV PATH /app/node_modules/.bin:$PATH

COPY package.json ./
# no lock file for CI
RUN yarn install --frozen-lockfile --network-timeout 600000
COPY . ./
RUN yarn build

# Stage 2 - the production environment
FROM nginx:1.16.0-alpine

COPY --from=build /app/build /usr/share/nginx/html/
RUN rm /etc/nginx/conf.d/default.conf
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
