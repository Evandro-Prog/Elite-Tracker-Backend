import { User } from './userType';

export {};

declare global {
  namespace Express {
    export interface Request {
      user: User;
    }
  }
}
