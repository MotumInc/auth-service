FROM node:12

WORKDIR /usr/motum/auth

COPY package.json ./
COPY yarn.lock ./
COPY .env ./
COPY .env.example ./
COPY out ./out
RUN yarn install

EXPOSE 5506
CMD ["yarn", "start"]