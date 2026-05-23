import type { SignOptions } from "jsonwebtoken";
import { env } from "./env.js";

type AuthConfig = {
	jwt: {
		secret: string | undefined;
		expiresIn: NonNullable<SignOptions["expiresIn"]>;
	};
};

export const authConfig: AuthConfig = {
	jwt: {
		secret: env.JWT_SECRET,
		expiresIn: "1d",
	},
};
