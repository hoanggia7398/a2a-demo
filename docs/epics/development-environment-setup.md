# Development Environment Setup Checklist - Epic 2.0

## Overview

This checklist ensures consistent development environment setup for Epic 2.0 Backend API Implementation. Follow all steps in order to avoid setup issues and integration problems.

**Target Audience**: Developers starting Epic 2.0 implementation  
**Prerequisites**: Epic 1.0 frontend environment working  
**Estimated Setup Time**: 30-45 minutes

---

## ✅ **Pre-Setup Verification**

### Epic 1.0 Frontend Environment Check

- [ ] **Next.js app running**: `cd apps/web && npm run dev` works successfully
- [ ] **Frontend dependencies installed**: `node_modules` present in `apps/web/`
- [ ] **TypeScript compiling**: No TypeScript errors in existing frontend code
- [ ] **Browser access**: Frontend accessible at `http://localhost:3000` (or similar)
- [ ] **Story 1.5 working**: Orchestrator-only model functional

**⚠️ If any checks fail**: Resolve Epic 1.0 environment issues before proceeding

---

## 🔧 **System Requirements**

### Required Software Versions

- [ ] **Node.js**: Version 20.11 (LTS) or compatible
  ```bash
  node --version  # Should show v20.11.x or compatible
  ```
- [ ] **npm**: Version 10.x or compatible
  ```bash
  npm --version  # Should show 10.x.x
  ```
- [ ] **Git**: Any recent version for repository management
- [ ] **VS Code**: Recommended IDE with TypeScript support

### Operating System Compatibility

- [ ] **Windows**: 10/11 (current development environment ✅)
- [ ] **macOS**: 10.15+
- [ ] **Linux**: Ubuntu 18.04+ or equivalent

---

## 📁 **Backend Project Structure Setup**

### 1. Create API Directory Structure

```bash
# From project root
mkdir -p apps/api/src/{agents,core,routes,types,utils}
mkdir -p apps/api/src/agents/{pm,analyst,design}
mkdir -p apps/api/src/core/{database,websocket,auth}
mkdir -p apps/api/tests
```

**Verify directory structure**:

- [ ] `apps/api/src/agents/` exists
- [ ] `apps/api/src/core/` exists
- [ ] `apps/api/src/routes/` exists
- [ ] `apps/api/src/types/` exists
- [ ] `apps/api/tests/` exists

### 2. Initialize Backend Package

```bash
cd apps/api
npm init -y
```

- [ ] **package.json created** in `apps/api/`
- [ ] **Package name**: Should be `api` or `@a2a/api`

---

## 📦 **Backend Dependencies Installation**

### Core Dependencies

```bash
cd apps/api

# Express.js and middleware
npm install express@^4.19.0
npm install cors@^2.8.5
npm install helmet@^7.0.0
npm install compression@^1.7.4

# JSON-RPC 2.0
npm install jayson@^4.1.0

# Database (SQLite)
npm install sqlite3@^5.1.6
npm install better-sqlite3@^8.7.0

# WebSocket
npm install ws@^8.14.0
npm install @types/ws@^8.5.0

# Authentication
npm install jsonwebtoken@^9.0.2
npm install bcryptjs@^2.4.3

# Utilities
npm install uuid@^9.0.0
npm install dotenv@^16.3.0
```

### Development Dependencies

```bash
# TypeScript setup
npm install -D typescript@^5.4.0
npm install -D @types/node@^20.11.0
npm install -D @types/express@^4.17.0
npm install -D @types/cors@^2.8.0
npm install -D @types/jsonwebtoken@^9.0.0
npm install -D @types/bcryptjs@^2.4.0
npm install -D @types/uuid@^9.0.0

# Development tools
npm install -D nodemon@^3.0.0
npm install -D ts-node@^10.9.0
npm install -D concurrently@^8.2.0

# Testing
npm install -D jest@^29.7.0
npm install -D @types/jest@^29.5.0
npm install -D ts-jest@^29.1.0
npm install -D supertest@^6.3.0
npm install -D @types/supertest@^2.0.0
```

**Verification**:

- [ ] **package.json** contains all listed dependencies
- [ ] **node_modules** directory created
- [ ] **package-lock.json** generated

---

## ⚙️ **TypeScript Configuration**

### 1. Create TypeScript Config

Create `apps/api/tsconfig.json`:

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "commonjs",
    "lib": ["ES2022"],
    "outDir": "./dist",
    "rootDir": "./src",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "forceConsistentCasingInFileNames": true,
    "resolveJsonModule": true,
    "declaration": true,
    "declarationMap": true,
    "sourceMap": true,
    "removeComments": false,
    "noImplicitAny": true,
    "strictNullChecks": true,
    "strictFunctionTypes": true,
    "noImplicitReturns": true,
    "noFallthroughCasesInSwitch": true,
    "noUncheckedIndexedAccess": true,
    "noImplicitOverride": true,
    "exactOptionalPropertyTypes": true,
    "baseUrl": "./src",
    "paths": {
      "@/*": ["*"],
      "@/agents/*": ["agents/*"],
      "@/core/*": ["core/*"],
      "@/types/*": ["types/*"],
      "@/utils/*": ["utils/*"]
    }
  },
  "include": ["src/**/*"],
  "exclude": ["node_modules", "dist", "tests"]
}
```

**Verification**:

- [ ] **tsconfig.json** created with above content
- [ ] **TypeScript compilation test**: `npx tsc --noEmit` runs without errors

### 2. Create Jest Configuration

Create `apps/api/jest.config.js`:

```javascript
module.exports = {
  preset: "ts-jest",
  testEnvironment: "node",
  rootDir: "./src",
  testMatch: ["**/__tests__/**/*.test.ts"],
  collectCoverageFrom: ["**/*.ts", "!**/*.d.ts", "!**/node_modules/**"],
  coverageDirectory: "../coverage",
  coverageReporters: ["text", "lcov", "html"],
};
```

---

## 🗄️ **Database Setup**

### 1. SQLite Database Initialization

Create `apps/api/src/core/database/init.sql`:

```sql
-- Users table
CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    username TEXT UNIQUE NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password_hash TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Agents table
CREATE TABLE IF NOT EXISTS agents (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'idle',
    current_task TEXT,
    last_activity DATETIME DEFAULT CURRENT_TIMESTAMP,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Tasks table
CREATE TABLE IF NOT EXISTS tasks (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'pending',
    assigner TEXT NOT NULL,
    assignee TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (assignee) REFERENCES agents(id)
);

-- Artifacts table
CREATE TABLE IF NOT EXISTS artifacts (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    type TEXT NOT NULL,
    content TEXT,
    content_url TEXT,
    creator TEXT NOT NULL,
    transferred_to TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    updated_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (creator) REFERENCES agents(id),
    FOREIGN KEY (transferred_to) REFERENCES agents(id)
);

-- System logs table
CREATE TABLE IF NOT EXISTS system_logs (
    id TEXT PRIMARY KEY,
    message TEXT NOT NULL,
    type TEXT NOT NULL,
    source TEXT NOT NULL,
    metadata TEXT, -- JSON string
    timestamp DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Sessions table
CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    token_hash TEXT NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
);

-- Insert default agents
INSERT OR IGNORE INTO agents (id, name, status) VALUES
    ('pm-agent', 'PM Agent', 'idle'),
    ('analyst-agent', 'Analyst Agent', 'idle'),
    ('design-agent', 'Design Agent', 'idle'),
    ('orchestrator-agent', 'Orchestrator Agent', 'active');
```

### 2. Database Connection Test

Create `apps/api/src/core/database/connection.ts`:

```typescript
import Database from "better-sqlite3";
import { readFileSync } from "fs";
import { join } from "path";

const DB_PATH = process.env.DB_PATH || "./data/a2a-demo.db";

export function initializeDatabase() {
  try {
    const db = new Database(DB_PATH);

    // Read and execute initialization SQL
    const initSQL = readFileSync(join(__dirname, "init.sql"), "utf-8");
    db.exec(initSQL);

    console.log("✅ Database initialized successfully");
    return db;
  } catch (error) {
    console.error("❌ Database initialization failed:", error);
    throw error;
  }
}

// Test connection
export function testConnection() {
  try {
    const db = initializeDatabase();
    const result = db.prepare("SELECT COUNT(*) as count FROM agents").get();
    console.log(
      `✅ Database connection test passed. Agents count: ${
        (result as any).count
      }`
    );
    db.close();
    return true;
  } catch (error) {
    console.error("❌ Database connection test failed:", error);
    return false;
  }
}
```

**Verification**:

- [ ] **SQL file created** with schema definitions
- [ ] **Connection test file** created
- [ ] **Database directory**: Create `apps/api/data/` for SQLite file
- [ ] **Test database connection**: `cd apps/api && npx ts-node src/core/database/connection.ts`

---

## 📜 **Package Scripts Setup**

### Update `apps/api/package.json` scripts:

```json
{
  "scripts": {
    "dev": "nodemon --exec ts-node src/index.ts",
    "build": "tsc",
    "start": "node dist/index.js",
    "test": "jest",
    "test:watch": "jest --watch",
    "test:coverage": "jest --coverage",
    "db:init": "ts-node src/core/database/connection.ts",
    "db:test": "ts-node -e \"require('./src/core/database/connection').testConnection()\"",
    "lint": "echo 'Linting not configured yet'",
    "clean": "rm -rf dist"
  }
}
```

**Verification**:

- [ ] **Scripts added** to package.json
- [ ] **Database test**: `npm run db:test` passes
- [ ] **Development script**: `npm run dev` command exists (will fail until index.ts created)

---

## 🌐 **Environment Configuration**

### 1. Create Environment Files

Create `apps/api/.env.example`:

```env
# Server Configuration
PORT=3001
NODE_ENV=development
API_VERSION=2.0.0

# Database
DB_PATH=./data/a2a-demo.db

# Authentication
JWT_SECRET=your-super-secret-jwt-key-change-in-production
JWT_EXPIRES_IN=24h
SESSION_TIMEOUT=86400000

# Security
BCRYPT_ROUNDS=12
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100

# WebSocket
WS_PORT=3001
WS_PATH=/ws

# CORS
CORS_ORIGIN=http://localhost:3000
```

Create `apps/api/.env`:

```env
# Copy from .env.example and customize for development
PORT=3001
NODE_ENV=development
API_VERSION=2.0.0
DB_PATH=./data/a2a-demo.db
JWT_SECRET=dev-secret-key-not-for-production
JWT_EXPIRES_IN=24h
SESSION_TIMEOUT=86400000
BCRYPT_ROUNDS=10
RATE_LIMIT_WINDOW=60000
RATE_LIMIT_MAX=100
WS_PORT=3001
WS_PATH=/ws
CORS_ORIGIN=http://localhost:3000
```

**Verification**:

- [ ] **Environment files created**
- [ ] **Sensitive values**: Different between .env.example and .env
- [ ] **Port configuration**: API on 3001, Frontend on 3000

---

## 🚀 **Basic Server Setup Verification**

### 1. Create Minimal Server

Create `apps/api/src/index.ts`:

```typescript
import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import dotenv from "dotenv";
import { testConnection } from "./core/database/connection";

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(helmet());
app.use(cors({ origin: process.env.CORS_ORIGIN }));
app.use(compression());
app.use(express.json());

// Health check endpoint
app.get("/health", (req, res) => {
  res.json({
    status: "healthy",
    timestamp: new Date().toISOString(),
    version: process.env.API_VERSION || "2.0.0",
    environment: process.env.NODE_ENV || "development",
  });
});

// Test database connection on startup
async function startServer() {
  try {
    // Test database
    const dbConnected = testConnection();
    if (!dbConnected) {
      throw new Error("Database connection failed");
    }

    // Start server
    app.listen(PORT, () => {
      console.log(`🚀 API Server running on http://localhost:${PORT}`);
      console.log(`📊 Health check: http://localhost:${PORT}/health`);
      console.log(`🗄️ Database: Connected successfully`);
      console.log(`🌍 Environment: ${process.env.NODE_ENV}`);
    });
  } catch (error) {
    console.error("❌ Server startup failed:", error);
    process.exit(1);
  }
}

startServer();
```

**Verification**:

- [ ] **Server file created**
- [ ] **Start test**: `npm run dev` starts server successfully
- [ ] **Health check**: `curl http://localhost:3001/health` returns JSON
- [ ] **Database connection**: No database errors in console
- [ ] **Port availability**: Server binds to port 3001

---

## 🔗 **Integration with Existing Project**

### 1. Update Root Package.json

Add API scripts to root `package.json`:

```json
{
  "scripts": {
    "dev": "concurrently \"npm run dev --workspace=apps/web\" \"npm run dev --workspace=apps/api\"",
    "dev:web": "npm run dev --workspace=apps/web",
    "dev:api": "npm run dev --workspace=apps/api",
    "build": "npm run build --workspace=apps/web && npm run build --workspace=apps/api",
    "test": "npm run test --workspace=apps/web && npm run test --workspace=apps/api"
  }
}
```

### 2. Update Turbo Configuration

Update `turbo.json` to include API:

```json
{
  "pipeline": {
    "build": {
      "dependsOn": ["^build"],
      "outputs": ["dist/**", ".next/**", "!.next/cache/**"]
    },
    "dev": {
      "cache": false,
      "persistent": true
    },
    "test": {
      "dependsOn": ["^build"]
    }
  }
}
```

**Verification**:

- [ ] **Root scripts updated**
- [ ] **Concurrent development**: `npm run dev` starts both web and API
- [ ] **Individual commands**: `npm run dev:api` and `npm run dev:web` work separately
- [ ] **Turbo integration**: `turbo dev` command works (if using Turbo)

---

## ✅ **Final Environment Verification**

### Complete Setup Test

Run these commands from project root:

1. **Install all dependencies**:

   ```bash
   npm install
   ```

2. **Start both servers**:

   ```bash
   npm run dev
   ```

3. **Verify endpoints**:

   - [ ] **Frontend**: http://localhost:3000 loads Epic 1.5 interface
   - [ ] **API Health**: http://localhost:3001/health returns JSON
   - [ ] **No errors**: Both servers start without errors

4. **Database verification**:

   ```bash
   cd apps/api && npm run db:test
   ```

5. **TypeScript compilation**:
   ```bash
   cd apps/api && npx tsc --noEmit
   ```

### Environment Status Check

- [ ] **✅ Frontend Environment**: Epic 1.0 working and accessible
- [ ] **✅ Backend Environment**: API server starts and responds
- [ ] **✅ Database Environment**: SQLite connected and initialized
- [ ] **✅ TypeScript Environment**: Compilation working without errors
- [ ] **✅ Development Workflow**: Both servers running concurrently
- [ ] **✅ Testing Environment**: Jest configuration ready

---

## 🔧 **Troubleshooting Common Issues**

### Issue: Port 3001 already in use

**Solution**:

```bash
# Kill process using port 3001
npx kill-port 3001
# Or change PORT in .env file
```

### Issue: SQLite database permission errors

**Solution**:

```bash
# Create data directory with proper permissions
mkdir -p apps/api/data
chmod 755 apps/api/data
```

### Issue: TypeScript compilation errors

**Solution**:

```bash
# Clean and reinstall TypeScript
cd apps/api
rm -rf node_modules package-lock.json
npm install
```

### Issue: Database initialization fails

**Solution**:

```bash
# Delete and recreate database
rm apps/api/data/a2a-demo.db
cd apps/api && npm run db:init
```

---

## ✅ **Setup Complete Checklist**

Before proceeding to Story 2.1 implementation:

- [ ] **All environment checks passed**
- [ ] **Both frontend and API servers running**
- [ ] **Database connection successful**
- [ ] **TypeScript compilation working**
- [ ] **Health endpoint responding**
- [ ] **Epic 1.0 functionality still working**
- [ ] **Development workflow established**

**🎉 Environment setup complete! Ready for Epic 2.0 Story 2.1 implementation.**

---

**Document Owner**: Product Owner Sarah  
**Setup Time**: ~45 minutes  
**Last Updated**: July 1, 2025  
**Next Step**: Begin Story 2.1 implementation
