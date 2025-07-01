"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.healthRoutes = void 0;
const express_1 = require("express");
const connection_1 = require("../core/database/connection");
exports.healthRoutes = (0, express_1.Router)();
// Basic health check
exports.healthRoutes.get("/", (req, res) => {
    try {
        const db = (0, connection_1.getDatabase)();
        const agents = db.prepare("SELECT COUNT(*) as count FROM agents").get();
        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            version: "2.0.0",
            database: {
                status: "connected",
                agents: agents.count,
            },
            uptime: process.uptime(),
            environment: process.env.NODE_ENV || "development",
        });
    }
    catch (error) {
        res.status(503).json({
            status: "unhealthy",
            error: "Database connection failed",
            timestamp: new Date().toISOString(),
        });
    }
});
// Detailed health check
exports.healthRoutes.get("/detailed", (req, res) => {
    try {
        const db = (0, connection_1.getDatabase)();
        // Get agent statuses
        const agents = db
            .prepare("SELECT id, name, status, last_activity FROM agents")
            .all();
        // Get recent system logs
        const recentLogs = db
            .prepare(`
      SELECT level, message, event_type, timestamp 
      FROM system_logs 
      ORDER BY timestamp DESC 
      LIMIT 10
    `)
            .all();
        res.json({
            status: "healthy",
            timestamp: new Date().toISOString(),
            version: "2.0.0",
            system: {
                uptime: process.uptime(),
                memory: process.memoryUsage(),
                pid: process.pid,
                platform: process.platform,
                node_version: process.version,
            },
            database: {
                status: "connected",
                path: process.env.DATABASE_PATH || "./data/a2a-demo.db",
            },
            agents: agents,
            recentActivity: recentLogs,
        });
    }
    catch (error) {
        res.status(503).json({
            status: "unhealthy",
            error: error instanceof Error ? error.message : "Unknown error",
            timestamp: new Date().toISOString(),
        });
    }
});
//# sourceMappingURL=health.js.map