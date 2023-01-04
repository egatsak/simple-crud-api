import { checkIfValidUUID } from "./helpers";
import { IReq } from "../../framework/Application";

/* type Params = {
  [key: string]: any;
}; */

export default (baseUrl: any) => (req: IReq, res: any) => {
  const url = req.url;

  const parsedUrl = new URL(url!, baseUrl);
  const pathnameParts = req.url!.split("/");

  if (pathnameParts.length > 4) {
    console.log("Incorrect URL");
    res.writeHead(400);
    res.end("Incorrect URL");
    return;
  }

  const id = pathnameParts[3];

  if (!checkIfValidUUID(id)) {
    console.log("invalid UUID");
    res.writeHead(400);
    res.end("Incorrect URL: Invalid UUID");
    return;
  }

  /*   const params = {} as Params;
  parsedUrl.searchParams.forEach((value, key) => {
    params[key] = value;
  }); */

  req.pathname = parsedUrl.pathname;
  /*   req.params = params; */
  req.id = id;
};
