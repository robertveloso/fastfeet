#scp -r ./.env.production ./docker-compose.autodeploy.yml ./traefik.toml root@165.227.93.226:~/
#ssh root@142.93.120.172 "docker-compose -f docker-compose.autodeploy.yml stop; docker-compose -f docker-compose.autodeploy.yml rm --force;  docker pull docker.pkg.github.com/robertveloso/cidades/api:latest; docker pull docker.pkg.github.com/robertveloso/cidades/web:latest; docker-compose -f docker-compose.autodeploy.yml up -d"


#docker login docker.pkg.github.com --username robertveloso -p c3a5249aea122438c6532e486af932640538b94f

docker build -t docker.pkg.github.com/robertveloso/fominha/frontend:latest -f dockerfiles/frontend.dockerfile ./frontend
docker build -t docker.pkg.github.com/robertveloso/fominha/backend:latest -f dockerfiles/backend.dockerfile ./backend

docker push docker.pkg.github.com/robertveloso/fominha/frontend:latest
docker push docker.pkg.github.com/robertveloso/fominha/backend:latest

#env $(cat .env.production) docker-compose stop
#env $(cat .env.production) docker-compose rm --force

#env $(cat .env.production) docker-compose down

#docker pull docker.pkg.github.com/robertveloso/mercadofuturo/frontend:latest
#docker pull docker.pkg.github.com/robertveloso/mercadofuturo/backend:latest

#env $(cat .env.production) docker-compose up -d --build

#env $(cat .env.production) docker-compose down && docker pull docker.pkg.github.com/robertveloso/mercadofuturo/frontend:latest && docker pull docker.pkg.github.com/robertveloso/mercadofuturo/backend:latest && env $(cat .env.production) docker-compose up -d --build



backend yarn resetDatabase
add dotenv sequelize-cli, config.json
