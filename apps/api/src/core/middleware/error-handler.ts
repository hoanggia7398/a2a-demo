import { Request, Response, NextFunction } from "express";

export interface ApiError extends Error {
  statusCode?: number;
  code?: string;
  data?: any;
}

export const errorHandler = (
  error: ApiError,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  // Log error for debugging
  console.error("API Error:", {
    message: error.message,
    stack: error.stack,
    url: req.url,
    method: req.method,
    timestamp: new Date().toISOString(),
  });

  // Default error response
  const statusCode = error.statusCode || 500;
  const response = {
    error: {
      message: error.message || "Internal Server Error",
      code: error.code || "INTERNAL_ERROR",
      timestamp: new Date().toISOString(),
      ...(process.env.NODE_ENV === "development" && {
        stack: error.stack,
        data: error.data,
      }),
    },
  };

  res.status(statusCode).json(response);
};
