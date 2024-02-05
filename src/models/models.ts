import { IncomingMessage, ServerResponse } from 'node:http';

export interface User {
  id: string;
  username: string;
  age: number;
  hobbies: string[];
}

export type UserDto = Omit<User, 'id'>;

export interface Req extends IncomingMessage {
  body?: any;
  pathname?: string;
  err?: unknown;
  errorStatus?: number;
  errorMessage?: string;
  id?: string;
}

export interface Res extends ServerResponse<Req> {
  req: Req;
  send: (data: unknown, code?: number) => void;
}

export type Middleware = (req: Req, res: Res, body: any) => void;

export enum ErrorMessages {
  PAGE_NOT_FOUND = 'Page not found',
  MISSING_URL_ID = 'Missing user ID in URL',
  REQ_BODY_MISSING = 'Request body is missing',
  FAILED_PARSE_BODY = 'Failed to parse request body',
  INT_SERVER_ERROR = 'Internal Server Error',
  INCORRECT_REQ_DATA = 'Incorrect request data',
  USER_NOT_FOUND = 'User not found',
  INVALID_UUID = 'Invalid UUID',
  USER_ALREADY_EXISTS = 'User already exists',
  INVALID_USERNAME = 'Invalid username',
  INVALID_HOBBIES = 'Invalid hobbies',
  INVALID_AGE_VALUE = 'Invalid age value',
}

export enum HttpErrorStatusCode {
  BAD_REQUEST = 400,
  NOT_FOUND = 404,
  INT_SERVER_ERROR = 500,
}

export class HttpException extends Error {
  response: string;
  status: HttpErrorStatusCode;
  constructor(response: string, status: HttpErrorStatusCode) {
    super();
    this.response = response;
    this.status = status;
  }
}
