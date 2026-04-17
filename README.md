# Tiny Guestbook

Tiny Guestbook is a beginner-friendly web app built with Node.js, Express, and PostgreSQL. It has one page with a form to add guestbook entries and a list that shows saved entries newest first.

## Features

- One-page app built with plain HTML, CSS, and JavaScript
- Name and message form
- Entries saved in PostgreSQL
- Entries listed newest first
- `/health` endpoint for health checks
- `.env.example` for local setup

## Local Setup

### 1. Install requirements

- Node.js 18 or newer
- PostgreSQL

### 2. Create a PostgreSQL database

Create a database named `tiny_guestbook`.

Example with `psql`:

```sql
CREATE DATABASE tiny_guestbook;
```

### 3. Install dependencies

```bash
npm install
```

### 4. Create your local `.env` file

Copy `.env.example` to `.env` and update the values if needed.

Example:

```env
PORT=3000
DATABASE_URL=postgres://postgres:postgres@localhost:5432/tiny_guestbook
DB_SSL=false
```

You can also use the `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, and `PGDATABASE` variables instead of `DATABASE_URL`. If you use the `PG*` variables, leave `DATABASE_URL` empty.

### 5. Start the app

```bash
npm run dev
```

Or:

```bash
npm start
```

Then open `http://localhost:3000`.

The app creates its `guestbook_entries` table automatically when it starts.

## Health Check

Visit:

```text
http://localhost:3000/health
```

It returns JSON showing whether the app can talk to the database.

## Render Deployment Steps

### 1. Push this project to GitHub

Render will deploy from your GitHub repository.

### 2. Create a PostgreSQL database in Render

- In Render, create a new PostgreSQL service
- If your web service and database are in the same Render region, copy the database's internal connection string
- If you need to connect from outside Render, use the external connection string instead

### 3. Create a new Web Service in Render

- Connect your GitHub repository
- Choose the branch you want to deploy
- Runtime: `Node`

### 4. Set the Render build and start commands

- Build Command: `npm install`
- Start Command: `npm start`

### 5. Add environment variables in Render

Add:

- `DATABASE_URL` = your Render PostgreSQL connection string
- `DB_SSL` = `false` when using Render's internal database URL

Optional:

- `DB_SSL` = `true` if you choose an external database URL and your client needs SSL/TLS enabled

You do not need to set `NODE_ENV` manually for a Node service on Render. You can also leave `PORT` unset because Render usually provides it automatically.

### 6. Deploy

Render will install dependencies, start the Express server, and the app will create the table automatically on boot.

After deployment, you can test:

- `/` for the guestbook page
- `/health` for the health endpoint

## Project Structure

```text
.
|-- public/
|   |-- index.html
|   |-- script.js
|   `-- styles.css
|-- .env.example
|-- .gitignore
|-- db.js
|-- package.json
|-- README.md
`-- server.js
```
