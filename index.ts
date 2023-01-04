import Application from "./framework/Application";
import userRouter from "./src/user-router";
import jsonParser from "./framework/parseJson";
import { IUser } from "./models/models";

const PORT = process.env.PORT || 5000;
const API_URL = process.env.BASE_URL || "http://localhost:5000";

const app = new Application();

app.use(jsonParser);
//app.use(parseUrl(API_URL));
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
