import cors from "cors";
import express from "express";
import uploadConfig from "./config/uploadConfig.js";
import { errorHandling } from "./middlewares/errorHandling.js";
import { routes } from "./routes/index.js";

const app = express();

app.use(express.json());
app.use(cors());

app.use("/uploads", express.static(uploadConfig.UPLOAD_FOLDER));

app.use(routes);

app.get("/", (_req, res) => {
	res.status(200).json({ message: "API ONLINE" });
});

app.use(errorHandling);

export { app };
