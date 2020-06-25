FROM node:latest

WORKDIR /usr/src/app

COPY ./ ./

RUN npm install && \
  npm rebuild bcrypt

CMD ["nodemon "-r dotenv/config --exec babel-node src/index.js"]
