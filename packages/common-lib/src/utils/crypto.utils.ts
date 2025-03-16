// Basic crypto utilities
import * as crypto from "crypto";

export const generateRandomBytes = (length: number): string => {
  return crypto.randomBytes(length).toString("hex");
};

export const hashPassword = (password: string): string => {
  return crypto.createHash("sha256").update(password).digest("hex");
};
