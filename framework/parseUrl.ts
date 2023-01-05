import { checkIfValidUUID } from "../src/helpers/helpers";
import { IReq } from "../framework/Application";

/* type Params = {
  [key: string]: any;
}; */

export default (baseUrl: any) => (req: IReq, res: any) => {
  let url = req.url;
  if (url?.endsWith("/")) {
    url = url.slice(0, url.length - 1);
  }
  //console.log(url);
  const parsedUrl = new URL(url!, baseUrl);
  const pathnameParts = url!.split("/");
  // console.log(pathnameParts);

  if (pathnameParts.length > 4 && pathnameParts[4] !== "") {
    console.log("Incorrect URL");
    req.errorStatus = 400;
    req.errorMessage = "Incorrect URL";
    return;
  }

  const id = pathnameParts[3];
  console.log(id);
  if (pathnameParts[4]?.length > 0 || (id && !checkIfValidUUID(id))) {
    console.log("Invalid UUID");
    req.errorStatus = 400;
    req.errorMessage = "Invalid UUID";
    return;
  }

  if (checkIfValidUUID(id)) {
    req.id = id;
    pathnameParts.pop();
    req.pathname = pathnameParts.join("/") + "/:id";
    console.log(req.pathname, req.id);
    return;
  }

  req.pathname = parsedUrl.pathname;
  // console.log(parsedUrl.pathname);
  /*   req.id = id; */
  /*   req.params = params; */
};
