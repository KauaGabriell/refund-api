import type { ErrorRequestHandler } from "express";
import { ZodError, z } from "zod";
import { Prisma } from "../generated/prisma/client.js";
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

  if (error instanceof Prisma.PrismaClientKnownRequestError) {
    if (error.code === "P2002") {
      return response.status(409).json({
        message: "Email already exists",
        code: "EMAIL_ALREADY_EXISTS",
      });
    }
  }

  return response.status(500).json({ message: "Internal Server Error" });
};
