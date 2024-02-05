import cluster from 'node:cluster';

import Application from './framework/Application';
import ServerBalancer from './ServerBalancer';

import jsonParser from './framework/parseJson';
import parseUrl from './framework/parseUrl';
import bodyParser from './framework/bodyParser';

export const PORT = Number(process.env.PORT) ?? 5000;
const BASE_URL = process.env.BASE_URL ?? 'http://localhost';

const start = async () => {
  try {
    if (cluster.isPrimary) {
      const balancer = new ServerBalancer();

      balancer.listen(PORT, () => {
        console.log(`Balancer started on port ${PORT}`);
      });
    } else {
      const WORKER_PORT = PORT + cluster.worker!.id;
      const API_URL = BASE_URL + `:${WORKER_PORT}`;

      const appWorker = new Application();
      appWorker.use(bodyParser);
      appWorker.use(jsonParser);
      appWorker.use(parseUrl(API_URL));

      appWorker.initRouterMulti();
      appWorker.addRouterMulti();
      appWorker.listenPrimaryMulti();

      appWorker.listen(WORKER_PORT, () => {
        console.log(`Server started on port ${WORKER_PORT}`);
      });
    }
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start();
