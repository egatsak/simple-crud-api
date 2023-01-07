import request from "supertest";
import Application from "./framework/Application";
import bodyParser from "./framework/bodyParser";
import parseJson from "./framework/parseJson";
import parseUrl from "./framework/parseUrl";
import userRouter from "./src/user-router";

import { checkIfValidUUID } from "./src/helpers/helpers";

import { API_URL as baseURL } from ".";

import { IUser } from "./models/models";

const app = new Application();
app.use(bodyParser);
app.use(parseJson);
app.use(parseUrl(baseURL));
app.addRouter(userRouter);

const mockUser: Omit<IUser, "id"> = {
  username: "user1",
  age: 25,
  hobbies: ["JS", "TS", "REST API"]
};

const mockUserUpdate: Omit<IUser, "id"> = {
  username: "user2",
  age: 26,
  hobbies: ["drinking", "smoking", "girls"]
};

describe("Server App Test Case 1", () => {
  const response = request(app.server);
  let userId: any;

  afterAll((done) => {
    app.close(() => {});
    done();
  });

  it("should GET all users and return empty array", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });

  it("should GET unknown url and receive error response", async () => {
    const res = await response.get("/api/us/12345");
    expect(res.statusCode).toBe(404);
  });

  it("should POST and add new user", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    const user = res.body as IUser;
    userId = user.id;
    expect(user.username).toBe(mockUser.username);
    expect(user.age).toBe(mockUser.age);
    expect(user.hobbies).toEqual(mockUser.hobbies);
    expect(checkIfValidUUID(user.id)).toBe(true);
  });

  it("should check if added user is in the DB", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    const users = res.body as IUser[];
    const user = users.find((us) => us.id === userId);
    expect(user?.username).toBe(mockUser.username);
    expect(user?.age).toBe(mockUser.age);
    expect(user?.hobbies).toEqual(mockUser.hobbies);
  });

  it("should GET user by pathname with userID", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    const user = res.body as IUser;
    expect(user?.username).toBe(mockUser.username);
    expect(user?.age).toBe(mockUser.age);
    expect(user?.hobbies).toEqual(mockUser.hobbies);
  });

  it("should PUT and update user", async () => {
    const res = await response
      .put(`/api/users/${userId}`)
      .send(mockUserUpdate);
    expect(res.statusCode).toBe(200);
    const user = res.body as IUser;
    expect(user?.username).toBe(mockUserUpdate.username);
    expect(user?.age).toBe(mockUserUpdate.age);
    expect(user?.hobbies).toEqual(mockUserUpdate.hobbies);
  });

  it("should DELETE and delete user", async () => {
    const res = await response.delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
    expect(res.body).toBe("");
  });

  it("should return empty array", async () => {
    const res = await response.get("/api/users");
    expect(res.statusCode).toBe(200);
    expect(res.body).toEqual([]);
  });
});

describe("Server App Test Case 2", () => {
  const response = request(app.server);
  let userId: any;

  afterAll((done) => {
    app.close(() => {});
    done();
  });

  it("should POST and create new user", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    const user = res.body as IUser;
    userId = user.id;
    expect(user.username).toBe(mockUser.username);
    expect(user.age).toBe(mockUser.age);
    expect(user.hobbies).toEqual(mockUser.hobbies);
    expect(checkIfValidUUID(user.id)).toBe(true);
  });

  it("should GET and check if added user is in the DB by pathname with userID", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    const user = res.body as IUser;
    expect(user?.username).toBe(mockUser.username);
    expect(user?.age).toBe(mockUser.age);
    expect(user?.hobbies).toEqual(mockUser.hobbies);
  });

  it("should POST user with existing username and receive error response", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(400);
  });

  it("should PUT user with incorrect JSON and receive error response", async () => {
    const res = await response
      .put(`/api/users/${userId}`)
      .send({ ...mockUser, hobbies: null });
    expect(res.statusCode).toBe(400);
  });

  it("should DELETE and delete user", async () => {
    const res = await response.delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
    expect(res.body).toBe("");
  });

  it("should GET deleted user and receive error response", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
  });
});

describe("Server App Test Case 3", () => {
  const response = request(app.server);
  let userId: any;

  afterAll((done) => {
    app.close(() => {});
    done();
  });

  it("should POST and create new user", async () => {
    const res = await response.post("/api/users").send(mockUser);
    expect(res.statusCode).toBe(201);
    const user = res.body as IUser;
    userId = user.id;
    expect(user.username).toBe(mockUser.username);
    expect(user.age).toBe(mockUser.age);
    expect(user.hobbies).toEqual(mockUser.hobbies);
    expect(checkIfValidUUID(user.id)).toBe(true);
  });

  it("should GET and check if added user is in the DB by pathname with userID", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(200);
    const user = res.body as IUser;
    expect(user?.username).toBe(mockUser.username);
    expect(user?.age).toBe(mockUser.age);
    expect(user?.hobbies).toEqual(mockUser.hobbies);
  });

  it("should GET user with fake ID and receive error response", async () => {
    const res = await response.get(
      "/api/users/eb2e080f-2125-49ee-9ba5-4d2822a100d2"
    );
    expect(res.statusCode).toBe(404);
  });

  it("should GET user with invalid ID and receive error response", async () => {
    const res = await response.get(
      "/api/users/eb2e080f-2125-49ee-9ba5-4d28"
    );
    expect(res.statusCode).toBe(400);
  });

  it("should POST user with incorrect JSON and receive error response", async () => {
    const res = await response
      .post("/api/users")
      .send({ ...mockUser, username: null });
    expect(res.statusCode).toBe(400);
  });
});
