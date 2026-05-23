# StreamCore

StreamCore is a Spotify-style backend REST API built with Node.js, Express,
MongoDB, and Mongoose. It provides cookie-based JWT authentication, role-based
access control, music uploads through ImageKit, album management, and basic test,
lint, and formatting tooling.

## Features

- User registration, login, and logout
- JWT authentication stored in an HTTP cookie named `token`
- Role-based access for `user` and `artist`
- Artist-only music upload endpoint
- In-memory file handling with Multer before uploading to ImageKit
- Album creation with linked music tracks
- Authenticated music and album browsing
- Jest and Supertest setup for API tests
- ESLint and Prettier configuration for code quality and formatting

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- cookie-parser
- multer
- ImageKit Node SDK
- Jest
- Supertest
- ESLint
- Prettier
- Nodemon

## Project Structure

```text
StreamCore/
|-- .env.example
|-- .gitignore
|-- .prettierignore
|-- .prettierrc
|-- eslint.config.mjs
|-- jest.config.js
|-- package.json
|-- package-lock.json
|-- README.md
|-- server.js
`-- src/
    |-- app.js
    |-- controllers/
    |   |-- auth.controller.js
    |   `-- music.controller.js
    |-- db/
    |   `-- db.js
    |-- middlewares/
    |   `-- auth.middleware.js
    |-- models/
    |   |-- album.model.js
    |   |-- music.model.js
    |   `-- user.model.js
    |-- routes/
    |   |-- auth.routes.js
    |   `-- music.routes.js
    |-- services/
    |   `-- storage.service.js
    `-- tests/
        `-- app.test.js
```

## Getting Started

### Prerequisites

- Node.js
- npm
- MongoDB database, local or hosted
- ImageKit private key for file uploads

### Installation

```bash
git clone <repository-url>
cd StreamCore
npm install
```

### Environment Variables

Create a `.env` file in the project root. You can use `.env.example` as the
starting point:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/streamcore
JWT_SECRET_KEY=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

| Variable               | Description                               |
| ---------------------- | ----------------------------------------- |
| `PORT`                 | Port where the Express server will run    |
| `MONGO_URI`            | MongoDB connection string                 |
| `JWT_SECRET_KEY`       | Secret used to sign and verify JWT tokens |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key for file uploads     |

## Running The Project

Start the server:

```bash
npm start
```

Start the server in development mode with Nodemon:

```bash
npm run dev
```

By default, the API runs at:

```text
http://localhost:3000
```

If you configure a different `PORT`, use that port instead.

## Available Scripts

| Script                 | Description                                       |
| ---------------------- | ------------------------------------------------- |
| `npm start`            | Runs `server.js` with Node                        |
| `npm run dev`          | Runs `server.js` with Nodemon                     |
| `npm test`             | Runs Jest tests with dotenv config loaded         |
| `npm run test:watch`   | Runs Jest in watch mode with dotenv config loaded |
| `npm run lint`         | Runs ESLint across the project                    |
| `npm run format`       | Formats files with Prettier                       |
| `npm run format:check` | Checks formatting without modifying files         |

## API Reference

### Health Check

```http
GET /
```

Returns a simple HTML response:

```html
<h1>Hello from Node JS server</h1>
```

## Authentication

Authentication routes are mounted at `/api/auth`.

### Register

```http
POST /api/auth/register
Content-Type: application/json
```

Request body:

```json
{
  "username": "raj",
  "email": "raj@example.com",
  "password": "password123",
  "role": "artist"
}
```

Notes:

- `role` is optional.
- The default role is `user`.
- Accepted roles are `user` and `artist`.
- A successful registration creates a `token` cookie.

Successful response:

```json
{
  "message": "User registered successfully",
  "user": {
    "id": "user_id",
    "username": "raj",
    "email": "raj@example.com",
    "role": "artist"
  }
}
```

### Login

```http
POST /api/auth/login
Content-Type: application/json
```

Request body:

```json
{
  "email": "raj@example.com",
  "password": "password123"
}
```

You can log in with either `email` or `username`.

Successful response:

```json
{
  "message": "User logged in successfully",
  "user": {
    "id": "user_id",
    "username": "raj",
    "email": "raj@example.com",
    "role": "artist"
  }
}
```

### Logout

```http
POST /api/auth/logout
```

Clears the `token` cookie.

Successful response:

```json
{
  "message": "User logged out successfully"
}
```

## Music And Albums

Music routes are mounted at `/api/music`.

These endpoints require a valid `token` cookie. Upload and album creation also
require the authenticated user to have the `artist` role.

### Upload Music

```http
POST /api/music/upload
Content-Type: multipart/form-data
```

Required role: `artist`

| Field   | Type | Description                |
| ------- | ---- | -------------------------- |
| `title` | text | Music title                |
| `file`  | file | Music/audio file to upload |

Example:

```bash
curl -X POST http://localhost:3000/api/music/upload \
  -b "token=<your-token-cookie>" \
  -F "title=First Track" \
  -F "file=@./song.mp3"
```

Successful response:

```json
{
  "message": "Music created successfully",
  "music": {
    "id": "music_id",
    "uri": "https://ik.imagekit.io/...",
    "title": "First Track",
    "artist": "artist_user_id"
  }
}
```

### Create Album

```http
POST /api/music/album
Content-Type: application/json
```

Required role: `artist`

Request body:

```json
{
  "title": "My First Album",
  "musics": ["music_id_1", "music_id_2"]
}
```

Successful response:

```json
{
  "message": "Album created successfully",
  "album": {
    "id": "album_id",
    "title": "My First Album",
    "artist": "artist_user_id",
    "musics": ["music_id_1", "music_id_2"]
  }
}
```

### Get All Music

```http
GET /api/music
```

Required role: `user` or `artist`

Returns up to 10 music records with `username` and `email` populated for each
artist.

### Get All Albums

```http
GET /api/music/albums
```

Required role: `user` or `artist`

Returns albums with artist details and music records populated.

### Get Album By ID

```http
GET /api/music/albums/:albumId
```

Required role: `user` or `artist`

Returns one album by MongoDB document ID with artist details populated.

## Authentication Flow

1. Register or log in through `/api/auth/register` or `/api/auth/login`.
2. The server signs a JWT containing the user ID and role.
3. The JWT is stored in a cookie named `token`.
4. Protected routes read and verify the token from cookies.
5. Artist-only routes require the decoded token to have `role: "artist"`.

When testing in Postman, Insomnia, or a browser, keep cookies enabled so
protected requests include the `token` cookie automatically.

## Data Models

### User

```js
{
  username: String,
  email: String,
  password: String,
  role: 'user' | 'artist'
}
```

### Music

```js
{
  uri: String,
  title: String,
  artist: ObjectId
}
```

### Album

```js
{
  title: String,
  musics: ObjectId[],
  artist: ObjectId
}
```

## Testing

The project uses Jest with the Node test environment and Supertest for HTTP
endpoint testing. The current test suite includes a health check test for
`GET /`.

Run tests with:

```bash
npm test
```

Run tests in watch mode with:

```bash
npm run test:watch
```

## Code Quality

ESLint is configured through `eslint.config.mjs` with Node, browser, and Jest
globals. Prettier is configured through `.prettierrc`, and generated or
environment-specific files are ignored through `.prettierignore`.

Useful commands:

```bash
npm run lint
npm run format
npm run format:check
```

## Notes

- Uploaded music files are stored in ImageKit under the `back-end/music` folder.
- Multer uses memory storage, so files are read from memory before upload.
- Passwords are hashed with bcrypt before being saved.
- JWTs are signed with `JWT_SECRET_KEY`.
- Authentication currently uses cookies only.
- MongoDB connection is started from `server.js` when the HTTP server starts.
