import type { RequestUserEntity } from 'src/auth/JwtPayload';

declare module 'express-serve-static-core' {
  type User = RequestUserEntity;

  interface Request {
    user?: User;
  }
}
