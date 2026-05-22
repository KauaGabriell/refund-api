import express from "express";

const app = express();
app.use(express.json());

app.get("/", (_req, res) => {
  res.json({ message: "API ONLINE" });
});

export { app };
