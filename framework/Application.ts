import http, {
  createServer,
  IncomingMessage,
  ServerResponse
} from "http";
import EventEmitter from "events";
import Router from "./Router";

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
  sockets: Set<any>;
  middlewares: any[];
  constructor() {
    this.emitter = new EventEmitter();
    this.server = this._createServer();
    this.middlewares = [];
    this.sockets = new Set();
  }

  use(middleware: any) {
    this.middlewares.push(middleware);
  }

  listen(port: number, callback: any) {
    this.server.on("connection", (socket) => {
      this.sockets.add(socket);

      this.server.once("close", () => {
        this.sockets.delete(socket);
      });
    });

    this.server.listen(port, callback);
  }

  close(callback: any) {
    /*     this.server.close(callback); */
    setImmediate(() => {
      this.server.emit("close");
    });
    this.sockets.forEach((val: any) => {
      val.destroy();
      this.sockets.delete(val);
    });
    this.server.closeAllConnections();
    this.server.close(callback);
    callback();
  }
  kill() {
    process.exit();
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
        /*         if (body) {
          (req as IReq).body = JSON.parse(body);
        } */

        this.middlewares.forEach((middleware) =>
          middleware(req, res, body)
        );

        const emitted = this.emitter.emit(
          this._getRouteMask((req as IReq).pathname, req.method),
          req,
          res
        );

        if (!emitted || (req as IReq).errorStatus) {
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
