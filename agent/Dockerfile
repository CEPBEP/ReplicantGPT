FROM node:14

RUN apt-get update && apt-get install -y git

copy . /app
RUN cd /app && npm i

WORKDIR /project
