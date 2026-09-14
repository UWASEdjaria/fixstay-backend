import { Request } from 'express';
import jwt from 'jsonwebtoken';
import { AuthenticatedUser, JwtTokenPayload } from '../interfaces/auth.interface';

const JWT_SECRET: string = process.env.JWT_SECRET ?? 'stayfix_dev_secret_key';

export function expressAuthentication(
  request: Request,
  securityName: string,
  scopes?: string[]
): Promise<AuthenticatedUser> {
  if (securityName !== 'jwt') {
    return Promise.reject(new Error(`Unsupported security protocol: ${securityName}`));
  }

  const authHeader: string | undefined = request.headers['authorization'];
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return Promise.reject(new Error('Missing or malformed Authorization header.'));
  }

  const token: string = authHeader.substring(7);

  return new Promise((resolve, reject) => {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err || !decoded) {
        return reject(new Error('Invalid or expired token.'));
      }

      const payload: JwtTokenPayload = decoded as JwtTokenPayload;

      if (scopes && scopes.length > 0 && !scopes.includes(payload.role)) {
        return reject(new Error('Forbidden: Insufficient privileges.'));
      }

      const user: AuthenticatedUser = {
        userId: payload.userId,
        email: payload.email,
        role: payload.role,
        roomId: payload.roomId,
      };

      resolve(user);
    });
  });
}
