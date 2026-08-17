import jwt, { Secret, SignOptions } from "jsonwebtoken";

export class TokenService {
  generateAccessToken(payload: object) {
    const secret: Secret = process.env.JWT_ACCESS_SECRET!;

    return jwt.sign(payload, secret, {
      expiresIn: process.env.ACCESS_TOKEN_EXPIRY as SignOptions["expiresIn"],
    });
  }

  generateRefreshToken(payload: object) {
    const secret: Secret = process.env.JWT_REFRESH_SECRET!;

    return jwt.sign(payload, secret, {
      expiresIn: process.env.REFRESH_TOKEN_EXPIRY as SignOptions["expiresIn"],
    });
  }

  verifyAccessToken(token: string) {
    return jwt.verify(token, process.env.JWT_ACCESS_SECRET!);
  }

  verifyRefreshToken(token: string) {
    return jwt.verify(token, process.env.JWT_REFRESH_SECRET!);
  }
}
