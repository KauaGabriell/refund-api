import type { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { authConfig } from "../config/authConfig.js";
import { AppError } from "../utils/AppError.js";

interface TokenPayloud {
  role: string;
  sub: string;
}

export function ensureAuthenticated(
  request: Request,
  _response: Response,
  next: NextFunction,
) {
  const authHeaders = request.headers.authorization;
  if (!authHeaders) throw new AppError("JWT TOKEN MISSING", 401);

  const [, token] = authHeaders.split(" ");
  if (!token) throw new AppError("Token is not Valid", 401);

  const secret = authConfig.jwt.secret;
  if (!secret) throw new AppError("JWT SECRET MISSING", 500);

  try {
    const { role, sub: user_id } = jwt.verify(token, secret) as TokenPayloud;
    request.user = { id: user_id, role };
    next();
  } catch {
    throw new AppError("JWT TOKEN INVALID", 401);
  }
}
