import { Router } from "express";
import { RefundController } from "../controllers/refundController.js";
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization.js";

const refundRoutes = Router();
const refundController = new RefundController();

refundRoutes.post(
  "/",
  verifyUserAuthorization(["employee"]),
  refundController.create,
);
refundRoutes.get(
  "/",
  verifyUserAuthorization(["manager"]),
  refundController.index,
);
refundRoutes.get(
  "/:refundId",
  verifyUserAuthorization(["manager", "employee"]),
  refundController.show,
);

export { refundRoutes };
