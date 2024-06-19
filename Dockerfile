FROM node:lts-alpine
WORKDIR /app
RUN npm install -g ts-node@9.1.1
RUN npm install -g db-migrate@0.11.13
COPY package.json .
COPY database.json .
COPY tsconfig.json .
RUN npm install --no-update-notifier
COPY . .
CMD [ "npm", "start" ]