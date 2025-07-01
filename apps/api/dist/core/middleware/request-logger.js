"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.requestLogger = void 0;
const requestLogger = (req, res, next) => {
    const startTime = Date.now();
    const timestamp = new Date().toISOString();
    // Log incoming request
    console.log(`[${timestamp}] ${req.method} ${req.url}`, {
        ip: req.ip,
        userAgent: req.get("User-Agent"),
        body: req.method === "POST" ? req.body : undefined,
    });
    // Log response when finished
    res.on("finish", () => {
        const duration = Date.now() - startTime;
        const logLevel = res.statusCode >= 400 ? "error" : "info";
        console.log(`[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`, {
            statusCode: res.statusCode,
            duration: `${duration}ms`,
            contentLength: res.get("Content-Length"),
        });
    });
    next();
};
exports.requestLogger = requestLogger;
//# sourceMappingURL=request-logger.js.map