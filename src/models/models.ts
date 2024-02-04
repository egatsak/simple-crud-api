import { IncomingMessage, ServerResponse } from 'node:http';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export interface Req extends IncomingMessage {
  body?: any;
  pathname?: string;
  err?: any;
  errorStatus?: number;
  errorMessage?: string;
  id?: string;
}

export interface Res extends ServerResponse<Req> {
  req: Req;
  send: (data: any, code?: number) => void;
}

export type Middleware = (req: Req, res: Res, body: any) => void;

export enum ErrorMessages {
  PAGE_NOT_FOUND = 'Page not found',
  INT_SERVER_ERROR = 'Internal Server Error',
  INCORRECT_REQ_DATA = 'Incorrect request data',
  USER_NOT_FOUND = 'User not found',
  REQ_BODY_MISSING = 'Request error! Please check request body',
  INVALID_UUID = 'Invalid UUID',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_USERNAME = 'Invalid username!',
  INVALID_HOBBIES = 'Invalid hobbies!',
  INVALID_AGE_VALUE = 'Invalid age value!',
  FAILED_PARSE_BODY = 'Failed to parse request body',
  MISSING_URL_ID = 'Missing user ID in URL',
}
