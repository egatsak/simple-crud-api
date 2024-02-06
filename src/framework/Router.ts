type Endpoints = {
  [key: string]: any;
};

class Router {
  endpoints: Endpoints;
  constructor() {
    this.endpoints = {};
  }

  request(method = 'GET', path: string, handler: () => void) {
    if (!this.endpoints[path]) {
      this.endpoints[path] = {};
    }
    const endpoint = this.endpoints[path];

    try {
      if (endpoint[method]) {
        throw new Error(`${method} on address ${path} already exists!`);
      }
    } catch (e) {
      console.log(e);
      process.exit(1);
    }

    endpoint[method] = handler;
  }

  get(path: string, handler: any) {
    this.request('GET', path, handler);
  }
  post(path: string, handler: any) {
    this.request('POST', path, handler);
  }
  put(path: string, handler: any) {
    this.request('PUT', path, handler);
  }
  delete(path: string, handler: any) {
    this.request('DELETE', path, handler);
  }
}

export default Router;
