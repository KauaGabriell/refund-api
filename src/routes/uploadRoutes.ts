import { Router } from "express";
import multer from "multer";
import uploadConfig from "../config/uploadConfig.js";
import { UploadController } from "../controllers/uploadController.js";
import { verifyUserAuthorization } from "../middlewares/verifyUserAuthorization.js";

const uploadRoutes = Router();
const uploadController = new UploadController();

const upload = multer(uploadConfig.MULTER);

uploadRoutes.post(
	"/",
	verifyUserAuthorization(["employee"]),
	upload.single("file"),
	uploadController.create,
);

export { uploadRoutes };
