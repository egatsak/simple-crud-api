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
  IRes,
  IUser
} from "../models/models";

import * as controllerMulti from "../user-controller-multi";

class Application {
  db: IUser[];
  emitter: EventEmitter;
  server: http.Server<typeof IncomingMessage, typeof ServerResponse>;
  sockets: Set<any>;
  middlewares: IMiddleware[];
  router: Router;

  constructor() {
    this.emitter = new EventEmitter();
    this.server = this._createServer();
    this.middlewares = [];
    this.sockets = new Set();
    this.router = new Router();
    this.db = [];
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

  sendDB(db: IUser[]) {
    if (process.send) process.send(db);
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

  initRouterMulti() {
    this.router.get("/api/users", controllerMulti.getUsers);
    this.router.post("/api/users", controllerMulti.createUser);
    this.router.get("/api/users/:id", controllerMulti.getUser);
    this.router.put("/api/users/:id", controllerMulti.updateUser);
    this.router.delete("/api/users/:id", controllerMulti.deleteUser);
    this.router.put("/api/users", controllerMulti.updateUser);
    this.router.delete("/api/users", controllerMulti.deleteUser);
  }

  addRouterMulti() {
    Object.keys(this.router.endpoints).forEach((path) => {
      const endpoint = this.router.endpoints[path];
      Object.keys(endpoint).forEach((method) => {
        this.emitter.on(
          this.getRouteMask(path, method),
          (req, res) => {
            const handler = endpoint[method];
            handler(req, res, this.db, this.sendDB);
          }
        );
      });
    });
  }

  listenPrimaryMulti() {
    process.on("message", (data) => {
      this.db = data as IUser[];
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
