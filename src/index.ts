import Application from './framework/Application';
import jsonParser from './framework/parseJson';
import parseUrl from './framework/parseUrl';
import bodyParser from './framework/bodyParser';

import userRouter from './user-router';

const PORT = Number(process.env.PORT) ?? 5000;
const BASE_URL = process.env.BASE_URL ?? 'http://localhost';
const API_URL = BASE_URL + `:${PORT}`;

export const app = new Application();

app.use(bodyParser);
app.use(jsonParser);
app.use(parseUrl(API_URL));
app.addRouter(userRouter);

const start = async () => {
  try {
    app.listen(PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
    process.exit(1);
  }
};

start();
