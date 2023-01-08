import http, {
  createServer,
  IncomingMessage,
  ServerResponse
} from "http";
import EventEmitter from "events";
import Router from "./Router";
import {
  ErrorMessages,
  IMiddleware,
  IReq,
  IRes
} from "../models/models";

class Application {
  emitter: EventEmitter;
  server: http.Server<typeof IncomingMessage, typeof ServerResponse>;
  sockets: Set<any>;
  middlewares: IMiddleware[];

  constructor() {
    this.emitter = new EventEmitter();
    this.server = this._createServer();
    this.middlewares = [];
    this.sockets = new Set();
  }

  use(middleware: IMiddleware) {
    this.middlewares.push(middleware);
  }

  listen(port: number, callback: () => void) {
    this.server.on("connection", (socket) => {
      this.sockets.add(socket);

      this.server.once("close", () => {
        this.sockets.delete(socket);
      });
    });

    this.server.listen(port, callback);
  }

  close(callback: () => void) {
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
          this.getRouteMask(path, method),
          (req, res) => {
            const handler = endpoint[method];
            handler(req, res);
          }
        );
      });
    });
  }

  _createServer() {
    return createServer((req: IReq, res: any) => {
      let body = "";
      req.on("data", (chunk) => {
        body += chunk;
      });

      req.on("end", () => {
        this.middlewares.forEach((middleware) =>
          middleware(req, res, body)
        );

        const emitted = this.emitter.emit(
          this.getRouteMask(req.pathname, req.method),
          req,
          res
        );

        if (!emitted || req.errorStatus) {
          try {
            (res as IRes).writeHead(req.errorStatus || 404);
            (res as IRes).end(
              req.err
                ? req.errorMessage
                : ErrorMessages.PAGE_NOT_FOUND
            );
          } catch (e) {
            console.log(e);
          }
        }
      });
    });
  }

  private getRouteMask(path: any, method: any) {
    return `[${path}]:[${method}]`;
  }
}

export default Application;
