# Base image
FROM node:12 AS base
WORKDIR /usr/motum/auth
COPY package.json .

# Dependancies image
FROM base AS deps
COPY yarn.lock .
COPY .env .
RUN yarn install --prod
RUN cp -R node_modules prod_node_modules
RUN yarn install

# Builder image
FROM deps AS build
COPY . .
RUN yarn build

# Production image
FROM base AS release

COPY .env.example .
COPY .env .
COPY --from=build /usr/motum/auth/out ./out
COPY --from=deps /usr/motum/auth/prod_node_modules ./node_modules

EXPOSE 5506