import "dotenv/config";
import { z } from "zod";

const envSchema = z.object({
  DATABASE_URL: z.url(),
  JWT_SECRET: z.string().trim(),
});

const env = envSchema.parse(process.env);

export { env };
