import express from "express";
import cors from "cors";
import helmet from "helmet";
import compression from "compression";
import { config } from "dotenv";
import path from "path";
import { createJsonRpcServer } from "./core/jsonrpc-server";
import { initializeDatabase } from "./core/database/connection";
import { healthRoutes } from "./routes/health";
import { errorHandler } from "./core/middleware/error-handler";
import { requestLogger } from "./core/middleware/request-logger";

// Load environment variables
config();

const app = express();
const PORT = process.env.PORT || 3001;

// Security middleware
app.use(helmet());
app.use(compression());

// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
  "http://localhost:3000",
];
app.use(
  cors({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
  })
);

// Body parsing middleware
app.use(express.json({ limit: "10mb" }));
app.use(express.urlencoded({ extended: true, limit: "10mb" }));

// Request logging
app.use(requestLogger);

// Health check routes
app.use("/health", healthRoutes);

// JSON-RPC 2.0 endpoint
const jsonRpcServer = createJsonRpcServer();
app.post("/api/rpc", jsonRpcServer.middleware());

// Root endpoint
app.get("/", (req, res) => {
  res.json({
    message: "A2A Demo Flow API Server",
    version: "2.0.0",
    status: "running",
    endpoints: {
      health: "/health",
      jsonRpc: "/api/rpc",
      documentation: "/api/docs",
    },
  });
});

// Error handling middleware (must be last)
app.use(errorHandler);

// Initialize database and start server
async function startServer() {
  try {
    // Initialize database connection
    await initializeDatabase();
    console.log("✅ Database initialized successfully");

    // Start HTTP server
    app.listen(PORT, () => {
      console.log(`🚀 A2A API Server running on port ${PORT}`);
      console.log(`📋 Health check: http://localhost:${PORT}/health`);
      console.log(`🔌 JSON-RPC endpoint: http://localhost:${PORT}/api/rpc`);
      console.log(`🌍 CORS enabled for: ${allowedOrigins.join(", ")}`);
    });
  } catch (error) {
    console.error("❌ Failed to start server:", error);
    process.exit(1);
  }
}

// Handle graceful shutdown
process.on("SIGTERM", () => {
  console.log("🛑 SIGTERM received, shutting down gracefully");
  process.exit(0);
});

process.on("SIGINT", () => {
  console.log("🛑 SIGINT received, shutting down gracefully");
  process.exit(0);
});

startServer();
