-- D1 schema for website-homepage database
-- Run with: wrangler d1 execute website-homepage --file=schema.sql

CREATE TABLE IF NOT EXISTS links (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  title       TEXT    NOT NULL,
  url         TEXT    NOT NULL,
  description TEXT    DEFAULT '',
  created_at  TEXT    DEFAULT (datetime('now'))
);
