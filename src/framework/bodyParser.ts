import { ErrorMessages, Req, Res } from '../models/models';
import { errorHandler } from '../helpers/errorHandler';

export default (req: Req, res: Res, body: any) => {
  try {
    if (body) {
      req.body = JSON.parse(body);
    }
  } catch (e) {
    errorHandler(req, ErrorMessages.FAILED_PARSE_BODY, 500, e);
  }
};
