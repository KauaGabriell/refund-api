import type { Request, Response } from "express";
import type { Prisma } from "../generated/prisma/client.js";
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
  async index(request: Request, response: Response) {
    const queryParams = z.object({
      name: z.string().optional().default(""),
      page: z.coerce.number().int().positive().optional().default(1),
      perPage: z.coerce.number().int().positive().optional().default(10),
    });
    const { name, page, perPage } = queryParams.parse(request.query);
    const where: Prisma.RefundsWhereInput = {
      user: {
        name: {
          contains: name.trim(),
        },
      },
    };
    const skip = (page - 1) * perPage;

    const [refunds, total] = await Promise.all([
      prisma.refunds.findMany({
        where,
        skip,
        take: perPage,
        orderBy: { createdAt: "desc" },
        include: {
          user: {
            select: {
              id: true,
              name: true,
              email: true,
              role: true,
            },
          },
        },
      }),
      prisma.refunds.count({ where }),
    ]);
    const pagination = {
      page,
      perPage,
      total,
      totalPages: Math.ceil(total / perPage),
    };

    return response.status(200).json({
      refunds,
      pagination,
    });
  }
}

export { RefundController };
