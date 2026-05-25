import type { Request, Response } from "express";
import { z } from "zod";
import { prisma } from "../libs/prisma.js";
import { AppError } from "../utils/AppError.js";

class RefundController {
  async create(request: Request, response: Response) {
    const bodySchema = z.object({
      name: z
        .string()
        .min(2, { message: "The name must have at least 2 characters." })
        .trim(),
      amount: z.number().positive(),
      category: z.enum([
        "food",
        "others",
        "services",
        "transport",
        "accommodation",
      ]),
      filename: z.string(),
    });
    if (!request.user) throw new AppError("Unauthorized", 401);
    const { name, amount, category, filename } = bodySchema.parse(request.body);
    const refund = await prisma.refunds.create({
      data: {
        name,
        amount,
        category,
        filename,
        userId: request.user.id,
      },
    });

    return response.status(200).json(refund);
  }
}

export { RefundController };
