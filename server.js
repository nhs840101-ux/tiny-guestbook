require("dotenv").config();

const path = require("path");
const express = require("express");
const { pool, initDatabase } = require("./db");

const app = express();
const port = Number(process.env.PORT || 3000);

// Parse JSON bodies sent by the browser.
app.use(express.json());

// Serve files from the public folder.
app.use(express.static(path.join(__dirname, "public")));

app.get("/health", async (_request, response) => {
  try {
    await pool.query("SELECT 1");
    response.json({ ok: true });
  } catch (error) {
    console.error("Health check failed:", error);
    response.status(500).json({ ok: false });
  }
});

app.get("/api/entries", async (_request, response) => {
  try {
    const result = await pool.query(`
      SELECT id, name, message, created_at
      FROM guestbook_entries
      ORDER BY created_at DESC, id DESC
    `);

    response.json(result.rows);
  } catch (error) {
    console.error("Failed to load entries:", error);
    response.status(500).json({ error: "Could not load entries." });
  }
});

app.post("/api/entries", async (request, response) => {
  const name = request.body.name?.trim();
  const message = request.body.message?.trim();

  if (!name || !message) {
    return response.status(400).json({
      error: "Name and message are required.",
    });
  }

  if (name.length > 100 || message.length > 500) {
    return response.status(400).json({
      error: "Name or message is too long.",
    });
  }

  try {
    const result = await pool.query(
      `
        INSERT INTO guestbook_entries (name, message)
        VALUES ($1, $2)
        RETURNING id, name, message, created_at
      `,
      [name, message]
    );

    response.status(201).json(result.rows[0]);
  } catch (error) {
    console.error("Failed to save entry:", error);
    response.status(500).json({ error: "Could not save entry." });
  }
});

async function startServer() {
  try {
    await initDatabase();

    app.listen(port, () => {
      console.log(`Tiny Guestbook is running at http://localhost:${port}`);
    });
  } catch (error) {
    console.error("Could not start the app:", error);
    process.exit(1);
  }
}

startServer();
