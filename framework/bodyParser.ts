import { IReq } from "./Application";

// todo!
export default (req: IReq, res: any, body: any) => {
  try {
    if (body) {
      (req as IReq).body = JSON.parse(body);
    }
  } catch (e: any) {
    console.log(e.message);
  }
};
