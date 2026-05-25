import type { Request, Response } from "express";
import { z } from "zod";
import { AppError } from "../utils/AppError.js";

class RefundController {
  async create(request: Request, response: Response) {
    return response.status(200).json({ message: "ok" });
  }
}

export { RefundController };
