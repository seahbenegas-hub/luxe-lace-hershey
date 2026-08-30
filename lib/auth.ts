import { SignJWT, jwtVerify } from "jose";
import { User } from "@/types";

const secret = new TextEncoder().encode(
  process.env.JWT_SECRET || "development-secret-change-me-in-production"
);

export async function createToken(user: User): Promise<string> {
  return new SignJWT({ ...user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime("7d")
    .sign(secret);
}

export async function verifyToken(token: string): Promise<User | null> {
  try {
    const { payload } = await jwtVerify(token, secret, { clockTolerance: 60 });
    return payload as unknown as User;
  } catch {
    return null;
  }
}

