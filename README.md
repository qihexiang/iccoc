# ICCOC Web

Here will introduce how to start developing on this project. 

This project is based on: 

- [Next.js](https://nextjs.org/)  
- [Prisma](https://www.prisma.io/)
- [MariaDB](https://mariadb.com/)
- [Redis](https://redis.io/)
- [Docker (Optional)](https://www.docker.com/)
- And other knowledge about W3 developing and deployment, you may need [Google](https://google.com).

## Pre-requirements

- Node.js >
- MariaDB/MySQL database
- Redis

Both MariaDB and Redis can be start by the `docker-compose.yml`.

## Configs

Most configs were settled in the dotenv(`.env`) file. Variables below are required for start the project:

- DATABASE_USERNAME: The username for connect to the database
- DATABASE_PASSWORD: The password for the database user
- DATABASE_HOST: Database's IP address (or hostname, but if it's a hostname, you need to change `docker-compose.yml`'s `services.database.ports` to make it work.)
- DATABASE_PORT: Database's listening port
- DATABASE_NAME: The name of the database
- DATABASE_URL: Database URL, you can get it by `"mysql://${DATABASE_USERNAME}:${DATABASE_PASSWORD}@${DATABASE_HOST}:${DATABASE_PORT}/${DATABASE_NAME}"`
- NODE_ENV: Node.js environment, can be set to `production` or `development`
- SECRET_COOKIE_PASSWORD: Password for encrypt the cookies, at least 32 characters
- APP_SECRET: Password for encrypt other data in this application

> Do never use same variables in development and production  environment! Do never upload `.env` file to a public repository!

## Datas not in Database

### jsonData

`jsonData` is a folder in the workdir. Now you need to provide such files in it:

#### `speakers.json`

This JSON contains two properties: `speakers` and `toBeUpdated`. This file controls what to display on the `/speakers`.

Example:

```jsonc
// Don't left comments in the prodcution environment JSON file.
{
  "speakers": [
    // [firstname, lastname, additional information]
    ["Paul W.", "Ayers", "(Mcmaster University, Canada)"],
    ["Zexing", "Cao", "(Xiamen University, China)"],
  ],
  // true or false   
  "toBeUpdated": true
}
```

### `data`

`data` directory in workdir is the place where to put user-uploaded attachments. You must create it before the application start.

## MDX and TSX

`.mdx` files in `pages` directory provide a way to write pages with Markdown syntax, but if you'd like to provide a more complex function, you need to write code in `.tsx` files. Most static pages were provided in 
`.mdx` format while intereactive pages (like pages in `/abstracts/` paths).

## Databases with docker-compose

It's recommended to create and run your databases with docker to make it more safe and controlable.

Redis will keep it's data in `redis` folder, MariaDB will keep it's data in `db` folder.

## dev and build

It's recommended to use pnpm to develop in this project.

```bash
# install pnpm
npm install pnpm -g
# Install dependencies
pnpm install
# Generate Prisma codes.
pnpm prisma generate
# Sync Prisma code with database.
pnpm prisma db push
# Start develop
pnpm dev
# Build an production version
pnpm build
# Build in docker for a Linux version(You may need to change the base image in Dockerfile to get a right build.)
# if it's first time build in docker:
mkdir out
touch out/iccoc.tar.bz2
# regular build:
pnpm package:docker
```