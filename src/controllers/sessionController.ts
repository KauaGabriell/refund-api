import type { Request, Response } from "express";
import jwt from "jsonwebtoken";
import { z } from "zod";
import { authConfig } from "../config/authConfig.js";
import { prisma } from "../libs/prisma.js";
import { AppError } from "../utils/AppError.js";
import { verifyPassword } from "../utils/hashAndVerifyPassword.js";

class SessionController {
  async login(request: Request, response: Response) {
    const bodySchema = z.object({
      email: z.email({ message: "Invalid Email" }).trim().toLowerCase(),
      password: z.string().min(5, { message: "Password must be 5 digits" }),
    });
    const { email, password } = bodySchema.parse(request.body);
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) throw new AppError("Invalid Credentials", 401);

    const checkedPassword = await verifyPassword(password, user.password);
    if (!checkedPassword) throw new AppError("Invalid Credentials", 401);

    const { secret, expiresIn } = authConfig.jwt;
    if (!secret) throw new AppError("JWT_SECRET missing", 500);

    const token = jwt.sign({ role: user.role }, secret, {
      subject: user.id,
      expiresIn,
    });

    const { password: _, ...userWithoutPassword } = user;

    return response.status(200).json({ token, user: userWithoutPassword });
  }
}

export { SessionController };
