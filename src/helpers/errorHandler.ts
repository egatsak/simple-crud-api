import { IReq } from "../../models/models";

export function errorHandler(
  req: IReq,
  errorMessage: string,
  errorStatus: number,
  e?: any
) {
  if (!req.err) {
    req.err = { message: errorMessage };
    req.errorMessage = errorMessage;
    if (e?.message) {
      req.errorMessage += `; ${e.message}`;
    }
    req.errorStatus = errorStatus;
  }
}
