const { Pool } = require("pg");

// Build the database settings from the environment.
// DATABASE_URL is convenient for hosting providers like Render.
function getDatabaseConfig() {
  if (process.env.DATABASE_URL) {
    const useSsl = process.env.DB_SSL === "true";

    return {
      connectionString: process.env.DATABASE_URL,
      ssl: useSsl ? { rejectUnauthorized: false } : false,
    };
  }

  return {
    host: process.env.PGHOST || "localhost",
    port: Number(process.env.PGPORT || 5432),
    user: process.env.PGUSER || "postgres",
    password: process.env.PGPASSWORD || "",
    database: process.env.PGDATABASE || "tiny_guestbook",
  };
}

const pool = new Pool(getDatabaseConfig());

async function initDatabase() {
  await pool.query(`
    CREATE TABLE IF NOT EXISTS guestbook_entries (
      id SERIAL PRIMARY KEY,
      name VARCHAR(100) NOT NULL,
      message VARCHAR(500) NOT NULL,
      created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
    )
  `);
}

module.exports = {
  pool,
  initDatabase,
};
