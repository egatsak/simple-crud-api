import request from "supertest";
import { API_URL as baseURL } from ".";
import Application from "./framework/Application";
import bodyParser from "./framework/bodyParser";
import parseJson from "./framework/parseJson";
import parseUrl from "./framework/parseUrl";
import { IUser } from "./models/models";
import userRouter from "./src/user-router";

const app = new Application();
app.use(bodyParser);
app.use(parseJson);
app.use(parseUrl(baseURL));
app.addRouter(userRouter);

describe("Server App Test", () => {
  const response = request(app.server);
  /*   beforeAll((done) => {
    done();
  }); */

  it("should return empty array", async () => {
    const res = await response.get("/api/users");

    expect(res.statusCode).toBe(200);

    expect(res.body).toEqual([]);
  });
  ///////////////////////////////////TODO tests!
  afterAll((done) => {
    // Closing the DB connection allows Jest to exit successfully.
    app.close(() => {
      console.log("Server closed");
    });
    done();
  });
  /*it("should return todos", async () => {
    const response = await request(baseURL).get("/todos");

    expect(response.body.data.length >= 1).toBe(true);
  }); */
});
