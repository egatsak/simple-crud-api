import { Req, Res } from '../models/models';

export default (_req: Req, res: Res) => {
  res.send = (data: unknown, statusCode: number = 200) => {
    res.writeHead(statusCode, { 'Content-Type': 'application/json' });
    res.end(JSON.stringify(data));
  };
};
