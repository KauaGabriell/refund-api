import cors from "cors";
import express from "express";
import { errorHandling } from "./middlewares/errorHandling.js";

const app = express();

app.use(express.json());
app.use(cors());

app.get("/", (_req, res) => {
  res.status(200).json({ message: "API ONLINE" });
});

app.use(errorHandling);

export { app };
