import Database from 'better-sqlite3';
import { drizzle as drizzleSqlite } from 'drizzle-orm/better-sqlite3';
import { users } from '@shared/schema';
import fs from 'fs';
import { sql } from 'drizzle-orm';

// Ensure the database directory exists
const dbDir = './data';
if (!fs.existsSync(dbDir)) {
  fs.mkdirSync(dbDir);
}

// Connect to SQLite database
const sqlite = new Database('./data/database.sqlite');
export const db = drizzleSqlite(sqlite);

// Initialize the database schema
export function initializeDatabase() {
  // Create users table if it doesn't exist
  sqlite.exec(`
    CREATE TABLE IF NOT EXISTS users (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      email TEXT UNIQUE NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    );
  `);

  // Check if there are any users, if not, add some initial data
  const userCount = db.select({ count: sql`count(*)` }).from(users).get();
  
  if (userCount.count === 0) {
    console.log('Adding initial users data...');
    db.insert(users).values([
      { name: 'John Doe', email: 'john@example.com' },
      { name: 'Jane Smith', email: 'jane@example.com' },
      { name: 'Robert Johnson', email: 'robert@example.com' }
    ]).run();
  }
  
  console.log('Database initialized successfully');
}

// Drop the database for testing purposes
export function dropDatabase() {
  sqlite.exec('DROP TABLE IF EXISTS users');
  console.log('Database dropped');
}
