# n8n-clone

A TypeScript + Express + MongoDB backend project for an n8n-style workflow/board system.

## Project status

This repository is in active early development.

Implemented so far:

- Express server bootstrap
- Environment variable validation
- MongoDB connection helper
- Global error middleware with Zod/AppError/Mongoose handling
- Board, Shape, and Connection Mongoose models
- Initial board service functions (`createBoard`, `addShape`)

Scaffolded but not implemented yet:

- API router wiring for Board/Auth modules
- Board controllers and route handlers
- Auth module implementation
- WebSocket middleware

## Tech stack

- Node.js
- TypeScript (ESM via `module: nodenext`)
- Express 5
- MongoDB + Mongoose
- Zod
- JSON Web Token (jsonwebtoken)

## Folder structure

```txt
src/
  app.ts
  router.ts
  server.ts
  config/
    env.ts
    mongo.ts
  Error/
    appError.ts
  middlewares/
    auth.middlware.ts
    error.middleware..ts
    ws.middleware.ts
  modules/
    Auth/
    Board/
      board.controller.ts
      board.model.ts
      board.routes.ts
      board.service.ts
      board.types.ts
```

## Available scripts

- `npm run build` : compile TypeScript into `dist/`
- `npm run start` : run compiled server from `dist/server.js`
- `npm run dev` : build then start

## Environment variables

Create a `.env` file (you can copy from `example.env`) and set:

- `DATABASE_URL`
- `ACCESS_TOKEN_SECRET`
- `REFRESH_TOKEN_SECRET`
- `ACCESS_TOKEN_EXPIRES_IN`
- `REFRESH_TOKEN_EXPIRES_IN`
- `PORT`

Notes:

- The current validation checks presence and ensures `PORT` is numeric when provided.
- Secret length/format checks are described in error messages but not fully enforced yet.

## Local setup

1. Install dependencies

```bash
npm install
```

2. Add environment variables in `.env`

3. Build and run

```bash
npm run dev
```

Server defaults to the `PORT` value from environment.

## Current HTTP routes

- `GET /` -> `server is up and live`
- `GET /health` -> `server is running healthy`
- `GET/POST/... /api/v1/*` -> placeholder router (no registered module routes yet)

## Known gaps and TODOs

- Connect `src/router.ts` to module routers (Board/Auth)
- Implement Board controllers + request validation
- Link shape creation to board membership
- Add connection create/remove service logic
- Implement auth middleware and token flow
- Wire and test database connection startup in app boot path
- Add tests (unit + integration)
