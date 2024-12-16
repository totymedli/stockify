# NestJS Stockify

NestJS service to fetch data from stock exchange APIs by a given symbol to calculate a moving average written in 2024 Q4 technologies.

## Features

- Start periodic fetch of stock symbol quotes from Finnhub and calculate their moving average.
- Swagger API docs
- Dockerized.

## Technologies

### Backend

- NestJS 10.4
- Swagger
- Dockerized environment via Docker Compose

## Requirements

- Docker with Docker Compose.

## Install

- Copy then populate the .env file: `cp .env-example .env`
- Build the containers: `docker-compse build`
- Run the dev env: `npm run docker-start:dev`

## Usage

- [http://localhost:3000](http://localhost:3000): API dev version
- [http://localhost:3000/api](http://localhost:3000/api): Swagger docs
- [http://localhost:8080](http://localhost:8080): API prod version

## Useful scripts

The servicenames are `stockify-dev-container` or `stockify-prod-container`.

- `npm run docker-start:dev`: Start development environment.
- `npm run docker-start:prod`: Start production environment.
- `npm run docker-dev-login`: Login to Docker container to use the CLI.
- `npm run docker-dev-logs`: Watch container logs.
