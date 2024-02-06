import { ErrorMessages, HttpException, Req } from '../models/models';

export function errorHandler(req: Req, error: unknown, message?: string) {
  if (!req.err) {
    if (error instanceof HttpException) {
      req.err = { message: error.response };
      req.errorMessage = error.response;
      req.errorStatus = error.status;
    } else {
      const customErrorMessage = message ?? ErrorMessages.INT_SERVER_ERROR;
      req.err = { message: customErrorMessage };
      req.errorMessage = customErrorMessage;
      req.errorStatus = 500;
    }
  }
}
