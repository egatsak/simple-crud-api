import { checkIfValidUUID } from "../src/helpers/helpers";
import { IReq } from "../framework/Application";

/* type Params = {
  [key: string]: any;
}; */

export default (baseUrl: string) => (req: IReq, res: any, _: any) => {
  let url = req.url;

  if (url?.endsWith("/")) {
    url = url.slice(0, url.length - 1);
  }

  const parsedUrl = new URL(url!, baseUrl);
  const pathnameParts = url!.split("/");

  // /api/users (kostyl')
  if (
    pathnameParts.length > 4 ||
    pathnameParts.slice(0, 3).join("/") !== "/api/users"
  ) {
    return;
  }

  const id = pathnameParts[3];

  if (id && !checkIfValidUUID(id)) {
    console.log("Invalid UUID");
    req.errorStatus = 400;
    req.errorMessage = "Invalid UUID";
    return;
  }

  if (checkIfValidUUID(id)) {
    req.id = id;
    pathnameParts.pop();
    req.pathname = pathnameParts.join("/") + "/:id";
    return;
  }

  req.pathname = parsedUrl.pathname;
};
