# syntax=docker/dockerfile:1

# FROM python:3.8-slim-buster

# FROM node:16

FROM bloodbrother/spency:stable-1.0.0

# WORKDIR /usr/src/app

# COPY package*.json ./

# RUN npm ci --only=production

COPY . .

CMD [ "npm", "start" ]