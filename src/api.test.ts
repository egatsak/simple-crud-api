import request from "supertest";
import { app } from ".";
import { checkIfValidUUID } from "./helpers/helpers";
import { ErrorMessages, IUser } from "./models/models";

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
    expect(res.text).toBe(ErrorMessages.PAGE_NOT_FOUND);
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
    expect(res.text).toBe(ErrorMessages.USER_ALREADY_EXISTS);
  });

  it("should POST user without age field and receive error response", async () => {
    const res = await response
      .post("/api/users")
      .send({ username: "John", hobbies: ["drink"] });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.INVALID_AGE_VALUE);
  });

  it("should PUT user with incorrect JSON and receive error response", async () => {
    const res = await response
      .put(`/api/users/${userId}`)
      .send({ ...mockUser, hobbies: null });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.INVALID_HOBBIES);
  });

  it("should DELETE and delete user", async () => {
    const res = await response.delete(`/api/users/${userId}`);
    expect(res.statusCode).toBe(204);
    expect(res.body).toBe("");
  });

  it("should GET deleted user and receive error response", async () => {
    const res = await response.get(`/api/users/${userId}`);
    expect(res.statusCode).toBe(404);
    expect(res.text).toBe(ErrorMessages.USER_NOT_FOUND);
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
    expect(res.text).toBe(ErrorMessages.USER_NOT_FOUND);
  });

  it("should GET user with invalid ID and receive error response", async () => {
    const res = await response.get(
      "/api/users/eb2e080f-2125-49ee-9ba5-4d28"
    );
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.INVALID_UUID);
  });

  it("should POST user with incorrect field values and receive error response", async () => {
    const res = await response
      .post("/api/users")
      .send({ ...mockUser, username: null });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.INVALID_USERNAME);
  });

  it("should POST user with incorrect JSON and receive error response", async () => {
    const { age, ...rest } = mockUser;
    const res = await response.post("/api/users").send(rest);
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.INVALID_AGE_VALUE);
  });

  it("should POST user with redundant fields and receive error response", async () => {
    const res = await response
      .post("/api/users")
      .send({ ...mockUser, baz: "foo" });
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.INCORRECT_REQ_DATA);
  });

  it("should POST user with empty JSON and receive error response", async () => {
    const res = await response.post("/api/users").send();
    expect(res.statusCode).toBe(400);
    expect(res.text).toBe(ErrorMessages.REQ_BODY_MISSING);
  });

  it("should POST user with invalid JSON and receive error response", async () => {
    const res = await response.post("/api/users").send(`eifneifn`);
    expect(res.statusCode).toBe(500);
    expect(res.text.slice(0, 28)).toBe(
      ErrorMessages.FAILED_PARSE_BODY
    );
  });
});
