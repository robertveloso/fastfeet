# frontend

curl -sL https://deb.nodesource.com/setup_14.x | sudo -E bash -
curl -sL https://dl.yarnpkg.com/debian/pubkey.gpg | sudo apt-key add -
echo "deb https://dl.yarnpkg.com/debian/ stable main" | sudo tee /etc/apt/sources.list.d/yarn.list
sudo apt update
apt-get install docker.io yarn nodejs -y
yarn global add pm2

export PORT=80
yarn build
pm2 start ./node_modules/react-scripts/scripts/start.js --name "mercadofuturo-frontend"

# backend

sudo curl -L https://github.com/docker/compose/releases/download/1.26.0/docker-compose-`uname -s`-`uname -m` -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose
docker-compose --version

sudo apt-get install gcc g++ build-essential gdb

yarn
yarn start

# docker

## frontend

### dev

docker build -t mercadofuturo:dev .
docker run -v \${PWD}:/app -v /app/node_modules -p 3001:3000 --rm mercadofuturo:dev
docker-compose up -d --build

### prod

docker build -f Dockerfile-prod -t mercadofuturo:prod .
docker run -it -p 8080:80 --rm mercadofuturo:prod
docker-compose -f docker-compose-prod.yml up -d --build
