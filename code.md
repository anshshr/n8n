# CODE CONTEXT - n8n-clone

This file is written for AI assistants and contributors to quickly understand the current codebase.

## 1) Purpose

Backend foundation for an n8n-like system where users can manage boards made of shapes and connections with JWT-based authentication and RBAC.

The implementation is early-stage and mostly focused on project scaffolding plus initial data model and service logic.

## 2) Runtime and build

- Language: TypeScript
- Module system: ESM (`type: module`, TS `module: nodenext`)
- Build output: `dist/`
- Entry point after build: `dist/server.js`

NPM scripts:

- `build`: `npx tsc -b`
- `start`: `node dist/server.js`
- `dev`: build then start

## 3) High-level architecture

- `src/server.ts`
  - Imports Express app from `app.ts`
  - Connects to MongoDB before boot
  - Reads `PORT` from env config
  - Starts HTTP server

- `src/app.ts`
  - Creates Express app
  - Adds JSON and URL-encoded middlewares
  - Mounts base API router on `/api/v1`
  - Registers global error middleware
  - Exposes root and health endpoints

- `src/router.ts`
  - Mounts Auth routes under `/auth`
  - Mounts Board routes under `/boards`

## 4) Configuration and infrastructure

- `src/config/env.ts`
  - Loads `.env` via `dotenv.config()`
  - Validates required env vars exist
  - Exports `appConfig`

- `src/config/mongo.ts`
  - Exports async DB connector function (named `connectiom` in current code)
  - Uses `mongoose.connect(appConfig.DATABASE_URL)`
  - Logs lifecycle messages on success/failure/finally

- `src/config/permissions.ts`
  - Central role to permission mapping
  - Current permissions:
    - `superadmin` => `*`
    - `admin` => board create/read/update/delete
    - `editor` => board create/read/update
    - `viewer` => board read

## 5) Error handling

- `src/Error/appError.ts`
  - Custom error class with `statusCode`

- `src/middlewares/error.middleware..ts`
  - Handles:
    - `ZodError` => 400 with issue list
    - `AppError` => custom status + message
    - `MongooseError` => 500 database error payload
  - Unknown errors => 500 safe fallback payload

- `src/middlewares/auth.middleware.ts`
  - Reads bearer token from `Authorization` header
  - Verifies access token
  - Attaches `{ userId, role }` to request

- `src/middlewares/rbac.middleware.ts`
  - Checks current user role against required permissions
  - Returns `403 Forbidden` when permission is missing

## 6) Domain models

### Auth module

Defined in `src/modules/Auth/auth.model.ts`.

#### User

- `name: string` (required, trimmed)
- `email: string` (required, unique, lowercase)
- `password: string` (required, hashed in service)
- `role: "superadmin" | "admin" | "editor" | "viewer"` (default `viewer`)
- `refreshToken: string | null`
- `isActive: boolean` (default `true`)
- timestamps enabled

### Board module

Defined in `src/modules/Board/board.model.ts`.

### Board

- `name: string` (required, trimmed)
- `desc: string` (optional, trimmed)
- `shapes: ObjectId[]` referencing `Shape`
- `connections: ObjectId[]` referencing `Connection`
- timestamps enabled

### Shape

- `x: string` (required)
- `y: string` (required)
- `name: string` (required, trimmed)
- `colour: string` (required)
- `height: string` (required)
- `width: string` (required)
- timestamps enabled

### Connection

- `from: ObjectId` -> `Shape`
- `to: ObjectId` -> `Shape`
- `board: ObjectId` -> `Board`
- `connType: "arrow" | "line"` (default `arrow`)
- timestamps enabled

## 7) Service layer status

### Auth services

Defined in `src/modules/Auth/auth.service.ts`.

Implemented:

- `register(name, email, password)`
  - Validates duplicate email at service layer
  - Hashes password with bcrypt
  - Creates user with default `viewer` role

- `login(email, password)`
  - Validates credentials
  - Rejects inactive users
  - Generates `accessToken` + `refreshToken`
  - Persists refresh token on user

- `refresh(refreshToken)`
  - Verifies refresh token
  - Matches token with stored DB token
  - Returns new access token

- `logout(userId)`
  - Clears persisted refresh token

- `getMe(userId)`
  - Returns sanitized current user data

- `updateRole(userId, role)`
  - Updates user role
  - Clears refresh token to force re-login after role change

### Board services

Defined in `src/modules/Board/board.service.ts`.

Implemented:

- `createBoard(name: string, desc: string)`
  - Creates a board with empty `shapes` and `connections` arrays.

- `getBoards()`
  - Returns all boards with populated `shapes` and `connections`

- `addShape(boardId, x, y, name, colour, height, width)`
  - Creates a shape document.
  - Attaches created shape to the target board.

Planned TODOs (commented in code):

- Remove shape from board
- Delete board
- Get all boards
- Delete all boards
- Add/remove board connections

## 8) Route/controller status

### Auth routes

Implemented in:

- `src/modules/Auth/auth.controller.ts`
- `src/modules/Auth/auth.routes.ts`
- `src/modules/Auth/auth.validation.ts`
- `src/modules/Auth/auth.types.ts`

### Board routes

Implemented in:

- `src/modules/Board/board.controller.ts`
- `src/modules/Board/board.routes.ts`

Current protected board routes:

- `GET /api/v1/boards` => authenticated + `board:read`
- `POST /api/v1/boards` => authenticated + `board:create`

Remaining placeholders:

- `src/middlewares/auth.middlware.ts`: old empty typo-named file still present, not used
- `src/middlewares/ws.middleware.ts`: empty

## 9) Existing HTTP contract

Live routes right now:

- `GET /` => "server is up and live"
- `GET /health` => "server is running healthy"
- `POST /api/v1/auth/register` => public
- `POST /api/v1/auth/login` => public
- `POST /api/v1/auth/refresh` => public with refresh token
- `POST /api/v1/auth/logout` => authenticated
- `GET /api/v1/auth/me` => authenticated
- `PATCH /api/v1/auth/:userId/role` => authenticated + `superadmin`
- `GET /api/v1/boards` => authenticated + RBAC
- `POST /api/v1/boards` => authenticated + RBAC

## 10) Important implementation notes for AI assistants

When editing this project:

- Preserve ESM imports with `.js` extension in TS import paths.
- Keep TypeScript strict compatibility.
- Avoid renaming files unless requested, even if there are typos in filenames.
- Prefer adding Board module routes under `/api/v1` by wiring router in `src/router.ts`.
- Add validation (likely Zod schemas) before controller/service calls.
- Ensure unknown errors in error middleware return a safe default response.
- Current auth role patch route uses RBAC `["*"]`, which effectively means `superadmin` only.

## 11) Immediate next recommended tasks

1. Add tests for auth service, auth middleware, and RBAC middleware behavior.
2. Expand Board module CRUD beyond list/create.
3. Define request/response types in `board.types.ts`.
4. Implement Auth session tracking if multi-login support is needed.
5. Implement WebSocket middleware for realtime board collaboration.
