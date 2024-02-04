import {errorHandler} from "../helpers/errorHandler";
import {ErrorMessages, Req} from "../models/models";
import {checkIfValidUUID} from "../helpers/helpers";

export default (baseUrl: string) => (req: Req, res: any, _: any) => {
  let url = req.url;

  if (!url) {
    errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500);
    return;
  }

  if (url.endsWith("/")) {
    url = url.slice(0, url.length - 1);
  }

  const parsedUrl = new URL(url, baseUrl);
  const pathnameParts = url.split("/");

  // /api/users (kostyl')
  if (pathnameParts.length > 4 || pathnameParts.slice(0, 3).join("/") !== "/api/users") {
    return;
  }

  const id = pathnameParts[3];

  if (id && !checkIfValidUUID(id)) {
    errorHandler(req, ErrorMessages.INVALID_UUID, 400);
    return;
  }

  if (checkIfValidUUID(id)) {
    req.id = id;
    pathnameParts.pop();
    req.pathname = pathnameParts.join("/") + "/:id";
    return;
  }

  req.pathname = parsedUrl.pathname;
  req.id = id;
};
