import { Router } from "express";
import { RefundController } from "../controllers/refundController.js";

const refundRoutes = Router();
const refundController = new RefundController();

refundRoutes.post("/", refundController.create);

export { refundRoutes };
