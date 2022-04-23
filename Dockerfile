FROM node:12

WORKDIR /usr/src/app

COPY package*.json ./

RUN npm i

COPY . . 

EXPOSE 4000

RUN npm create_database

CMD  ["npm",  "devStart"]
