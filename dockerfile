# FROM node:20-alpine

# COPY ./server .

# RUN npm install

# CMD [ "node" ,"server.js" ] 

#Frontend docker image
FROM node:20-alpine as frontend-builder

COPY ./client /app

WORKDIR /app

RUN npm install
RUN npm run build

#Backend docker image
FROM node:20-alpine as backend-builder

COPY ./server /app

WORKDIR /app

RUN npm install

COPY --from=frontend-builder /app/dist /app/public

CMD [ "node" , "server.js"]