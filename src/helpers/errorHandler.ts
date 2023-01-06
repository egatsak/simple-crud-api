import { IReq } from "../../framework/Application";

export function serverErrorHandler(
  req: IReq,
  errorMessage: string,
  errorStatus: number,
  e: any
) {
  console.log(e);
  req.errorMessage = errorMessage;
  req.errorStatus = errorStatus;
}
