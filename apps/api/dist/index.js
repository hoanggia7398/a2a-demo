"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const helmet_1 = __importDefault(require("helmet"));
const compression_1 = __importDefault(require("compression"));
const dotenv_1 = require("dotenv");
const jsonrpc_server_1 = require("./core/jsonrpc-server");
const connection_1 = require("./core/database/connection");
const health_1 = require("./routes/health");
const error_handler_1 = require("./core/middleware/error-handler");
const request_logger_1 = require("./core/middleware/request-logger");
// Load environment variables
(0, dotenv_1.config)();
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3001;
// Security middleware
app.use((0, helmet_1.default)());
app.use((0, compression_1.default)());
// CORS configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS?.split(",") || [
    "http://localhost:3000",
];
app.use((0, cors_1.default)({
    origin: allowedOrigins,
    credentials: true,
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "x-requested-with"],
}));
// Body parsing middleware
app.use(express_1.default.json({ limit: "10mb" }));
app.use(express_1.default.urlencoded({ extended: true, limit: "10mb" }));
// Request logging
app.use(request_logger_1.requestLogger);
// Health check routes
app.use("/health", health_1.healthRoutes);
// JSON-RPC 2.0 endpoint
const jsonRpcServer = (0, jsonrpc_server_1.createJsonRpcServer)();
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
app.use(error_handler_1.errorHandler);
// Initialize database and start server
async function startServer() {
    try {
        // Initialize database connection
        await (0, connection_1.initializeDatabase)();
        console.log("✅ Database initialized successfully");
        // Start HTTP server
        app.listen(PORT, () => {
            console.log(`🚀 A2A API Server running on port ${PORT}`);
            console.log(`📋 Health check: http://localhost:${PORT}/health`);
            console.log(`🔌 JSON-RPC endpoint: http://localhost:${PORT}/api/rpc`);
            console.log(`🌍 CORS enabled for: ${allowedOrigins.join(", ")}`);
        });
    }
    catch (error) {
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
//# sourceMappingURL=index.js.map