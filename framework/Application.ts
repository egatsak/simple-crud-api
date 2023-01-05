import http, {
  createServer,
  IncomingMessage,
  ServerResponse
} from "http";
import EventEmitter from "events";
import Router from "./Router";
import router from "../src/user-router";

/* export type ReqType = IncomingMessage & {
  body: any;
  pathname: string;
}; */

export interface IReq extends IncomingMessage {
  body: any;
  pathname: string;
  errorStatus?: number;
  errorMessage?: string;
  id?: string;
}

export type ResType = ServerResponse<IncomingMessage> & {
  req: IncomingMessage;
  send: (code: any, data: any) => void;
};

class Application {
  emitter: EventEmitter;
  server: http.Server<typeof IncomingMessage, typeof ServerResponse>;
  middlewares: any[];
  constructor() {
    this.emitter = new EventEmitter();
    this.server = this._createServer();
    this.middlewares = [];
  }

  use(middleware: any) {
    this.middlewares.push(middleware);
  }

  listen(port: number, callback: any) {
    this.server.listen(port, callback);
  }

  addRouter(router: Router) {
    Object.keys(router.endpoints).forEach((path) => {
      const endpoint = router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(
          this._getRouteMask(path, method),
          (req, res) => {
            const handler = endpoint[method];
            handler(req, res);
          }
        );
      });
    });
  }

  _createServer() {
    return createServer((req, res) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        if (body) {
          (req as IReq).body = JSON.parse(body);
        }

        this.middlewares.forEach((middleware) =>
          middleware(req, res)
        );

        const emitted = this.emitter.emit(
          this._getRouteMask((req as IReq).pathname, req.method),
          req,
          res
        );

        if (!emitted) {
          res.writeHead((req as IReq).errorStatus || 404);
          res.end((req as IReq).errorMessage || "Page not found!");
        }
      });
    });
  }

  _getRouteMask(path: any, method: any) {
    return `[${path}]:[${method}]`;
  }
}

export default Application;
