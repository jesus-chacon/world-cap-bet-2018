# world-cap-bet-2018

## Stack

* [Prisma.io](https://www.prisma.io/)
* [React.js](https://reactjs.org/)

## Requirements

Requires Node.js v8+ to run

## Instalation

### Install dependencies

```sh
npm install
cd server
npm install
```

### Create a .env file in server folder

```js
PRISMA_ENDPOINT="prisma endpoint"
PRISMA_SECRET="mysecret123"
APP_SECRET="jwtsecret123"
```

### Deploy service for generate prisma enviroment data

```sh
cd server
npm run prisma deploy
```

### Start prisma server

```sh
cd server
npm start
```

### Start react project

```sh
npm start
```