type Endpoints = {
  [key: string]: any;
};

class Router {
  endpoints: Endpoints;
  constructor() {
    this.endpoints = {};
  }

  request(method = "GET", path: any, handler: any) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }
    const endpoint = this.endpoints[path];

    if (endpoint[method]) {
      throw new Error(`${method} on address ${path} already exists!`);
    }

    endpoint[method] = handler;
  }

  get(path: any, handler: any) {
    this.request("GET", path, handler);
  }
  post(path: any, handler: any) {
    this.request("POST", path, handler);
  }
  put(path: any, handler: any) {
    this.request("PUT", path, handler);
  }
  delete(path: any, handler: any) {
    this.request("DELETE", path, handler);
  }
}

export default Router;
