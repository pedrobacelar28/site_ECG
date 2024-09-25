import { Request, Response, NextFunction } from "express";

// Interface para o tipo de erro personalizado
interface CustomError extends Error {
    statusCode?: number;
}

// Middleware de tratamento de erros
const errorHandler = (err: CustomError, req: Request, res: Response, next: NextFunction) => {
    console.error(`[ERROR]: ${err.message}`);

    const statusCode = err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(statusCode).json({
        status: "error",
        statusCode,
        message,
    });
};

export default errorHandler;
