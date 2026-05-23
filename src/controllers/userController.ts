import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../libs/prisma.js";
import { hashPassword } from "../utils/hashAndVerifyPassword.js";

class UserController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z.string().trim().min(2, { message: "Name is required" }),
      email: z.email({ message: "Invalid Email" }).trim().toLowerCase(),
      password: z.string().min(5, { message: "Password must be 5 digits" }),
      role: z.enum(["employee", "manager"]).default("employee"),
    });

    const {
      name,
      email,
      password: plainPassword,
      role,
    } = bodySchema.parse(request.body);
    const hashedPassword = await hashPassword(plainPassword);
    const user = await prisma.user.create({
      data: {
        name,
        email,
        password: hashedPassword,
        role,
      },
    });
    const { password, ...userWithoutPassword } = user;

    return response.status(200).json(userWithoutPassword);
  }
}

export { UserController };
