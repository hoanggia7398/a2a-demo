import Database from "better-sqlite3";
import path from "path";
import fs from "fs";

let db: Database.Database | null = null;

export interface DatabaseConfig {
  path: string;
  options?: Database.Options;
}

export const getDatabase = (): Database.Database => {
  if (!db) {
    throw new Error(
      "Database not initialized. Call initializeDatabase() first."
    );
  }
  return db;
};

export const initializeDatabase = async (): Promise<Database.Database> => {
  try {
    // Ensure data directory exists
    const dbPath = process.env.DATABASE_PATH || "./data/a2a-demo.db";
    const dbDir = path.dirname(dbPath);

    if (!fs.existsSync(dbDir)) {
      fs.mkdirSync(dbDir, { recursive: true });
      console.log(`📁 Created database directory: ${dbDir}`);
    }

    // Initialize SQLite database
    db = new Database(dbPath, {
      verbose: process.env.NODE_ENV === "development" ? console.log : undefined,
    });

    // Configure database settings
    db.pragma("journal_mode = WAL");
    db.pragma("synchronous = NORMAL");
    db.pragma("foreign_keys = ON");

    console.log(`🗄️  Database connected: ${dbPath}`);

    // Run initial schema setup
    await createTables();

    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
};

export const createTables = async (): Promise<void> => {
  if (!db) throw new Error("Database not initialized");

  try {
    // Create tables for A2A workflow management
    db.exec(`
      CREATE TABLE IF NOT EXISTS users (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        email TEXT UNIQUE,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS agents (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL CHECK (type IN ('pm', 'analyst', 'design', 'orchestrator')),
        status TEXT DEFAULT 'idle' CHECK (status IN ('idle', 'busy', 'active', 'error')),
        current_task TEXT,
        last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS tasks (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        status TEXT DEFAULT 'pending' CHECK (status IN ('pending', 'in_progress', 'completed', 'failed', 'delegated')),
        priority TEXT DEFAULT 'medium' CHECK (priority IN ('low', 'medium', 'high', 'urgent')),
        assigner_id TEXT,
        assignee_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        completed_at DATETIME,
        FOREIGN KEY (assigner_id) REFERENCES users(id),
        FOREIGN KEY (assignee_id) REFERENCES agents(id)
      );

      CREATE TABLE IF NOT EXISTS artifacts (
        id TEXT PRIMARY KEY,
        name TEXT NOT NULL,
        type TEXT NOT NULL,
        content TEXT NOT NULL,
        creator_agent_id TEXT,
        task_id TEXT,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (creator_agent_id) REFERENCES agents(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      CREATE TABLE IF NOT EXISTS system_logs (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        level TEXT DEFAULT 'info' CHECK (level IN ('debug', 'info', 'warn', 'error')),
        message TEXT NOT NULL,
        event_type TEXT,
        agent_id TEXT,
        task_id TEXT,
        data TEXT, -- JSON data
        timestamp DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (agent_id) REFERENCES agents(id),
        FOREIGN KEY (task_id) REFERENCES tasks(id)
      );

      CREATE TABLE IF NOT EXISTS sessions (
        id TEXT PRIMARY KEY,
        user_id TEXT,
        data TEXT, -- JSON session data
        expires_at DATETIME NOT NULL,
        created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (user_id) REFERENCES users(id)
      );
    `);

    // Insert default agents
    const insertAgent = db.prepare(`
      INSERT OR IGNORE INTO agents (id, name, type, status) 
      VALUES (?, ?, ?, 'idle')
    `);

    insertAgent.run("orchestrator", "Orchestrator Agent", "orchestrator");
    insertAgent.run("pm-agent", "PM Agent", "pm");
    insertAgent.run("analyst-agent", "Analyst Agent", "analyst");
    insertAgent.run("design-agent", "Design Agent", "design");

    console.log("✅ Database schema initialized successfully");
  } catch (error) {
    console.error("❌ Schema creation failed:", error);
    throw error;
  }
};

export const closeDatabase = (): void => {
  if (db) {
    db.close();
    db = null;
    console.log("🔒 Database connection closed");
  }
};
