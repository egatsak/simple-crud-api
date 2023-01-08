import dotenv from "dotenv";

import Application from "./framework/Application";
import jsonParser from "./framework/parseJson";
import parseUrl from "./framework/parseUrl";
import bodyParser from "./framework/bodyParser";
import userRouter from "./user-router";

import { IUser } from "./models/models";

dotenv.config();

const PORT = process.env.PORT || 5000;
export const API_URL =
  process.env.BASE_URL || "http://localhost:5000";

export const app = new Application();

app.use(bodyParser);
app.use(jsonParser);
app.use(parseUrl(API_URL));
app.addRouter(userRouter);

export const users = [] as IUser[];

const start = async () => {
  try {
    app.listen(+PORT, () => {
      console.log(`Server started on port ${PORT}`);
    });
  } catch (e) {
    console.log(e);
  }
};

start();
