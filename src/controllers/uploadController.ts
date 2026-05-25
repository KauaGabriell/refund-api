import type { Request, Response } from "express";
import { ZodError, z } from "zod";
import uploadConfig from "../config/uploadConfig.js";
import { AppError } from "../utils/AppError.js";
import { DiskStorage } from "../utils/DiskStorage.js";

class UploadController {
	async create(request: Request, response: Response) {
		const diskStorage = new DiskStorage();

		try {
			const fileSchema = z
				.object({
					filename: z.string().min(1, { message: "File is required" }),
					mimetype: z
						.string()
						.refine((file) => uploadConfig.FILES_TYPES.includes(file), {
							message: `Invalid Format. Allowed Format: ${uploadConfig.FILES_TYPES}`,
						}),
					size: z
						.number()
						.refine((size) => size <= uploadConfig.MAX_FILE_SIZE, {
							message: `Max Size for file is ${uploadConfig.MAX_SIZE}MB`,
						}),
				})
				.loose();

			const file = fileSchema.parse(request.file);

			const filename = await diskStorage.saveFile(file.filename);

			return response.status(200).json(filename);
		} catch (error) {
			if (error instanceof ZodError) {
				if (request.file) {
					await diskStorage.deleteFile(request.file.filename, "tmp");
				}

				throw new AppError(error.issues[0]?.message ?? "Invalid file");
			}

			throw error;
		}
	}
}

export { UploadController };
