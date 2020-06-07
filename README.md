# co-bot

**co-bot** is a Discord.JS bot built with djs-cc. It plays sounds, clears chat, gives players EXP for being in the chat, and lets you look up League of Legends profiles.

[*Docker Hub*](https://cloud.docker.com/u/matthewferderber/repository/docker/matthewferderber/co-bot)

## Requirements

- Docker

## Installation

- `docker-compose up`

## Useful Commands

- `docker-compose up --build cobot`: To rebuild the bot from latest src
- `docker-compose down -v`: To drop all volumes for cobot
- `docker push matthewferderber/co-bot:tagname`: To push a new version to docker-hub

You need to have your Discord Bot Token saved as an environment variable with the name DISCORD\_BOT\_TOKEN

You also need a League of Legends API key saved as an environment variable with the name LEAGUE\_API\_KEY