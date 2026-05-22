import type { ErrorRequestHandler } from "express";
import { ZodError, z } from "zod";
import { AppError } from "../utils/AppError.js";

export const errorHandling: ErrorRequestHandler = (
  error,
  _request,
  response,
  _next,
) => {
  if (error instanceof AppError)
    return response.status(error.statusCode).json({ message: error.message });

  if (error instanceof ZodError)
    return response
      .status(400)
      .json({ message: "Validation Error", issues: z.treeifyError(error) });

  return response.status(500).json({ message: "Internal Server Errro" });
};
