FROM node:14

RUN apt-get update && apt-get install -y git

COPY . /app
RUN cd /app && npm i
RUN git config --global --add safe.directory /project
RUN git config --global user.email "bot@example.com"
RUN git config --global user.name "Bot"
WORKDIR /project
