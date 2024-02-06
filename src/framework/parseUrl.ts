import { errorHandler } from '../helpers/errorHandler';
import { ErrorMessages, HttpException, Req } from '../models/models';
import { checkIfValidUUID } from '../helpers/helpers';

export default (baseUrl: string) => (req: Req) => {
  let url = req.url;

  try {
    if (!url) {
      throw new HttpException(ErrorMessages.INCORRECT_REQ_DATA, 400);
    }

    if (url.endsWith('/')) {
      url = url.slice(0, url.length - 1);
    }

    const parsedUrl = new URL(url, baseUrl);
    const pathnameParts = url.split('/');

    // TODO /api/users (kostyl')
    if (
      pathnameParts.length > 4 ||
      pathnameParts.slice(0, 3).join('/') !== '/api/users'
    ) {
      return;
    }

    const id = pathnameParts[3];

    if (id && !checkIfValidUUID(id)) {
      throw new HttpException(ErrorMessages.INVALID_UUID, 400);
    }

    if (checkIfValidUUID(id)) {
      req.id = id;
      pathnameParts.pop();
      req.pathname = pathnameParts.join('/') + '/:id';
      return;
    }

    req.pathname = parsedUrl.pathname;
    req.id = id;
  } catch (error) {
    errorHandler(req, error);
  }
};
