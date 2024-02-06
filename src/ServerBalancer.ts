import { Server, createServer, request as httpRequest } from 'node:http';
import { availableParallelism } from 'node:os';
import cluster, { Worker } from 'node:cluster';
import { EventEmitter } from 'node:events';

export default class ServerBalancer {
  cpusCount: number;
  workers: Worker[];
  emitter: EventEmitter;
  server: Server;
  workersCount: number;
  port: number;

  constructor(port: number) {
    this.port = port;
    this.cpusCount = availableParallelism() - 1;
    this.workers = [];
    this.workersCount = 0;
    this.emitter = new EventEmitter();
    this.server = this._createServer();
    this.createWorkers();
    this.listenChildWorkers();
  }

  listen(port: number, cb: () => void) {
    process.on('SIGINT', () => {
      this.server.close();
      this.workers.forEach((worker) => worker.kill());
    });

    this.server.listen(port, cb);
  }

  createWorkers() {
    for (let i = 0; i < this.cpusCount; i++) {
      const worker = cluster.fork();
      this.workers.push(worker);

      worker.on('message', (data) => {
        this.workers.forEach((worker) => {
          if (worker.id !== this.workersCount) worker.send(data);
        });
      });
    }
  }

  listenChildWorkers() {
    this.workers.forEach((worker) => {
      worker.on('message', (data) => {
        this.workers.forEach((worker) => {
          if (worker.id !== this.workersCount) {
            worker.send(data);
          }
        });
      });
    });
  }

  nextWorker() {
    const workersCount = this.workersCount;
    const workerId = this.workers[workersCount].id;
    if (workersCount === this.workers.length - 1) {
      this.workersCount = 0;
    } else {
      this.workersCount++;
    }

    return workerId;
  }

  _createServer() {
    return createServer((req, res) => {
      let body = '';
      req.on('data', (chunk) => {
        body += chunk;
      });

      req.on('end', () => {
        const workerId = this.nextWorker();

        const childPort = this.port + workerId;

        const workerRequest = httpRequest({
          host: 'localhost',
          port: childPort,
          path: req.url,
          method: req.method,
        });

        console.log('Request sent to port ' + childPort);

        workerRequest.on('error', (err) => {
          res.writeHead(500);
          res.end('Worker Connection Error ' + err?.message);
        });

        workerRequest.write(body);
        workerRequest.end();

        workerRequest.on('response', (workerRes) => {
          let body = '';

          workerRes.on('data', (chunk) => {
            body += chunk;
          });

          workerRes.on('end', () => {
            res.statusCode = workerRes.statusCode ?? 500;
            res.end(body);
          });
        });
      });
    });
  }
}
