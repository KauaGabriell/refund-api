import crypto from "node:crypto";
import path from "node:path";
import { fileURLToPath } from "node:url";
import multer from "multer";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TMP_FOLDER = path.resolve(__dirname, "..", "..", "tmp");
const UPLOAD_FOLDER = path.resolve(TMP_FOLDER, "uploads");

const MAX_SIZE = 3; //3MB
const MAX_FILE_SIZE = 1024 * 1024 * MAX_SIZE;
const FILES_TYPES = ["image/jpeg", "image/jpg", "image/png"];

const MULTER = {
	storage: multer.diskStorage({
		destination: TMP_FOLDER,
		filename(_request, file, callback) {
			const fileHash = crypto.randomBytes(10).toString("hex");
			const fileName = `${fileHash}-${file.originalname}`;
			return callback(null, fileName);
		},
	}),
};

export default {
	FILES_TYPES,
	MAX_SIZE,
	MAX_FILE_SIZE,
	MULTER,
	TMP_FOLDER,
	UPLOAD_FOLDER,
};
