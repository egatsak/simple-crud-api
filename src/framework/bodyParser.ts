import { ErrorMessages, Req, Res } from '../models/models';
import { errorHandler } from '../helpers/errorHandler';

export default (req: Req, res: Res, body: any) => {
  try {
    if (body) {
      req.body = JSON.parse(body);
    }
  } catch (error) {
    errorHandler(req, error, ErrorMessages.FAILED_PARSE_BODY);
  }
};
