import "dotenv/config";
import jwt from "jsonwebtoken";

interface TokenPayload {
  userId: string;
  email: string;
  role: string;
}

export class JwtService {
  private static readonly secret = process.env.JWT_SECRET || "default-secret";

  static generateToken(payload: TokenPayload): string {
    return jwt.sign(payload, this.secret, {
      expiresIn: "1h",
      issuer: "appointment-system",
      audience: "appointment-api",
    });
  }

  static verifyToken(token: string): TokenPayload {
    return jwt.verify(token, this.secret, {
      issuer: "appointment-system",
      audience: "appointment-api",
    }) as TokenPayload;
  }

  static decodeToken(token: string): TokenPayload | null {
    return jwt.decode(token) as TokenPayload;
  }
}
