# StreamCore

StreamCore is a simple Spotify-style backend API built with Node.js, Express, MongoDB, and Mongoose. It supports user authentication, artist-only music uploads, album creation, and authenticated music/album browsing.

## Features

- User registration, login, and logout
- JWT authentication stored in an HTTP cookie named `token`
- User roles: `user` and `artist`
- Artist-only music upload endpoint
- ImageKit storage integration for uploaded music files
- Album creation with linked music tracks
- Protected endpoints for listing music and albums

## Tech Stack

- Node.js
- Express 5
- MongoDB
- Mongoose
- JSON Web Tokens
- bcryptjs
- cookie-parser
- multer
- ImageKit

## Project Structure

```text
Stream-Core/
|-- server.js
|-- package.json
|-- src/
|   |-- app.js
|   |-- controllers/
|   |   |-- auth.controller.js
|   |   `-- music.controller.js
|   |-- db/
|   |   `-- db.js
|   |-- middlewares/
|   |   `-- auth.middleware.js
|   |-- models/
|   |   |-- album.model.js
|   |   |-- music.model.js
|   |   `-- user.model.js
|   |-- routes/
|   |   |-- auth.routes.js
|   |   `-- music.routes.js
|   `-- services/
|       `-- storage.service.js
`-- README.md
```

## Getting Started

### Prerequisites

Install these before running the project:

- Node.js
- npm
- MongoDB database, local or hosted
- ImageKit account/private key for file uploads

### Installation

Clone the repository and install dependencies:

```bash
git clone <repository-url>
cd Stream-Core
npm install
```

### Environment Variables

Create a `.env` file in the project root:

```env
PORT=3000
MONGO_URI=mongodb://127.0.0.1:27017/streamcore
JWT_SECRET_KEY=your_jwt_secret_key
IMAGEKIT_PRIVATE_KEY=your_imagekit_private_key
```

Variable details:

| Variable               | Description                                |
| ---------------------- | ------------------------------------------ |
| `PORT`                 | Port where the Express server will run     |
| `MONGO_URI`            | MongoDB connection string                  |
| `JWT_SECRET_KEY`       | Secret used to sign and verify JWT tokens  |
| `IMAGEKIT_PRIVATE_KEY` | ImageKit private key used for file uploads |

### Running the Server

Start the server in production mode:

```bash
npm start
```

Start the server in development mode with nodemon:

```bash
npm run dev
```

The API will be available at:

```text
http://localhost:3000
```

If you use a different `PORT`, replace `3000` with your configured port.

## API Reference

### Health Check

```http
GET /
```

Returns a simple HTML response from the server.

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
- Default role is `user`.
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

Clears the authentication cookie.

## Music And Albums

Music routes are mounted at `/api/music`.

These endpoints require a valid `token` cookie. Upload and album creation require the authenticated user to have the `artist` role.

### Upload Music

```http
POST /api/music/upload
Content-Type: multipart/form-data
```

Required role: `artist`

Form fields:

| Field   | Type | Description                |
| ------- | ---- | -------------------------- |
| `title` | text | Music title                |
| `file`  | file | Music/audio file to upload |

Example using curl:

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

Returns up to 10 music records with artist details populated.

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

Returns one album by MongoDB document ID.

## Authentication Flow

1. Register or log in through `/api/auth/register` or `/api/auth/login`.
2. The server signs a JWT and stores it in a cookie named `token`.
3. Protected routes read the token from cookies.
4. Artist routes check that the decoded token has `role: "artist"`.

When testing in Postman, Insomnia, or a browser, keep cookies enabled so protected requests include the `token` cookie automatically.

## Available Scripts

```bash
npm start
```

Runs the server with Node.

```bash
npm run dev
```

Runs the server with nodemon for development.

```bash
npm test
```

Currently configured as a placeholder and does not run automated tests.

## Data Models

### User

```js
{
  username: String,
  email: String,
  password: String,
  role: "user" | "artist"
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

## Notes

- Uploaded music files are stored through ImageKit.
- Passwords are hashed with bcrypt before being saved.
- JWTs are signed with `JWT_SECRET_KEY`.
- The API currently uses cookie-based authentication only.
- Automated tests are not configured yet.
