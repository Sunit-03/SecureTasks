import { NextFunction, Request, Response } from "express";
import { AppError } from "../utils/errors/app-error";
// import { AppError } from "../../../utils/errors/app-error";

export const errorMiddleware = (
  error: Error,
  _req: Request,
  res: Response,
  _next: NextFunction,
) => {
    console.log(error);
    if(error instanceof AppError){
        return res.status(error.statusCode).json({
            success: false,
            message: error.message
        });
    }

    return res.status(500).json({
        success: false,
        message: process.env.NODE_ENV === "production" ? "Internal Server Error" : error.message,
    })
};
