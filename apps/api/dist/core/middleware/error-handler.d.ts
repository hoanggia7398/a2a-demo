import { Request, Response, NextFunction } from "express";
export interface ApiError extends Error {
    statusCode?: number;
    code?: string;
    data?: any;
}
export declare const errorHandler: (error: ApiError, req: Request, res: Response, next: NextFunction) => void;
//# sourceMappingURL=error-handler.d.ts.map