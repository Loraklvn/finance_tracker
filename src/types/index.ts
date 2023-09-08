import { Request } from 'express';

export interface UserPayload {
  user_id: string;
  name: string;
  email: string;
}

export interface CustomRequest extends Request {
  user?: UserPayload;
}
