import jwt from "jsonwebtoken";
import { ApiError } from "./apiError.js";

const getSecret = () => {
  const secret = process.env.JWT_SECRET;
  if (!secret) {
    throw new Error("JWT_SECRET is not defined");
  }
  return secret;
};

export const signToken = (userId: string, role: string) => {
  const secret = getSecret();

  const expiresIn = (process.env.JWT_EXPIRES_IN ||
    "2h") as jwt.SignOptions["expiresIn"];
  return jwt.sign({ sub: userId, role }, secret, { expiresIn });
};

export const verifyToken = (token: string): { sub: string; role: string } => {
  const secret = getSecret();
  try {
    const decoded = jwt.verify(token, secret, { algorithms: ["HS256"] });
    if (
      typeof decoded !== "object" ||
      typeof decoded.sub !== "string" ||
      typeof decoded.role !== "string"
    ) {
      throw new Error("Invalid token payload");
    }

    return { sub: decoded.sub, role: decoded.role };
  } catch {
    throw new ApiError(401, "Invalid or expired token");
  }
};
