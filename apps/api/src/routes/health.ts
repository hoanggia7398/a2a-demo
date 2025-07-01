import { Router, Request, Response } from "express";
import { getDatabase } from "../core/database/connection";

export const healthRoutes = Router();

// Basic health check
healthRoutes.get("/", (req: Request, res: Response) => {
  try {
    const db = getDatabase();
    const agents = db.prepare("SELECT COUNT(*) as count FROM agents").get() as {
      count: number;
    };

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
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: "Database connection failed",
      timestamp: new Date().toISOString(),
    });
  }
});

// Detailed health check
healthRoutes.get("/detailed", (req: Request, res: Response) => {
  try {
    const db = getDatabase();

    // Get agent statuses
    const agents = db
      .prepare("SELECT id, name, status, last_activity FROM agents")
      .all() as Array<{
      id: string;
      name: string;
      status: string;
      last_activity: string;
    }>;

    // Get recent system logs
    const recentLogs = db
      .prepare(
        `
      SELECT level, message, event_type, timestamp 
      FROM system_logs 
      ORDER BY timestamp DESC 
      LIMIT 10
    `
      )
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
  } catch (error) {
    res.status(503).json({
      status: "unhealthy",
      error: error instanceof Error ? error.message : "Unknown error",
      timestamp: new Date().toISOString(),
    });
  }
});
