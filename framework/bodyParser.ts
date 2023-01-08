import { ErrorMessages, IReq, IRes } from "../models/models";
import { errorHandler } from "../src/helpers/errorHandler";

export default (req: IReq, res: IRes, body: any) => {
  try {
    if (body) {
      req.body = JSON.parse(body);
    }
  } catch (e: any) {
    errorHandler(req, ErrorMessages.FAILED_PARSE_BODY, 500, e);
  }
};
