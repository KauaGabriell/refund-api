import bcrypt from "bcrypt";
import { AppError } from "./AppError.js";

export async function hashPassword(password: string) {
  const hashPassword = await bcrypt.hash(password, 10);
  return hashPassword;
}

export async function verifyPassword(
  plainPassword: string,
  passwordHash: string,
) {
  const isValidPassword = await bcrypt.compare(plainPassword, passwordHash);
  if (!isValidPassword) throw new AppError("Invalid Credentials");

  return isValidPassword;
}
