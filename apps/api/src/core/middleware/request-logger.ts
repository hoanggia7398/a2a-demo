import { Request, Response, NextFunction } from "express";

export const requestLogger = (
  req: Request,
  res: Response,
  next: NextFunction
): void => {
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

    console.log(
      `[${timestamp}] ${req.method} ${req.url} - ${res.statusCode} (${duration}ms)`,
      {
        statusCode: res.statusCode,
        duration: `${duration}ms`,
        contentLength: res.get("Content-Length"),
      }
    );
  });

  next();
};
