import { Router } from "express";
import { ensureAuthenticated } from "../middlewares/ensureAuthentication.js";
import { refundRoutes } from "./refundRoutes.js";
import { sessionRoutes } from "./sessionRoutes.js";
import { userRoutes } from "./userRoutes.js";

const routes = Router();

routes.use("/users", userRoutes);
routes.use("/sessions", sessionRoutes);

//Private Routes
routes.use(ensureAuthenticated);
routes.use("/refunds", refundRoutes);

export { routes };
