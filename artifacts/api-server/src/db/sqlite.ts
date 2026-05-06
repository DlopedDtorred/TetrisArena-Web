import { DatabaseSync } from "node:sqlite";
import path from "path";
import { mkdirSync } from "fs";

const dataDir = path.resolve(__dirname, "../data");
mkdirSync(dataDir, { recursive: true });

const dbPath = path.join(dataDir, "db.sqlite");

const db = new DatabaseSync(dbPath);

db.exec(`PRAGMA journal_mode = WAL`);
db.exec(`PRAGMA foreign_keys = ON`);

db.exec(`
  CREATE TABLE IF NOT EXISTS competitions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    description TEXT,
    rules TEXT,
    start_date TEXT NOT NULL,
    end_date TEXT NOT NULL,
    banner TEXT,
    created_at TEXT DEFAULT (datetime('now'))
  );
`);

export default db;
