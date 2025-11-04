import jwt from "jsonwebtoken";

const JWT_SECRET = process.env.JWT_SECRET!; // must match backend secret

export function verifyToken(token: string) {
  try {
    // Decode & verify JWT
    const decoded = jwt.verify(token, JWT_SECRET) as {
      _id: string;
      email: string;
      role: "student" | "instructor" | "admin";
      iat: number;
      exp: number;
    };
    return decoded;
  } catch (err) {
    return null; // Invalid or expired token
  }
}
