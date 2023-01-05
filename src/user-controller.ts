import { randomUUID } from "crypto";
import { users } from "..";
import { IReq } from "../framework/Application";
import { IUser } from "../models/models";

//@desc   Get users
//@route  GET /api/users
export const getUsers = async (req: IReq, res: any) => {
  res.send(users);
};

//@desc   Create new user
//@route  POST /api/users
export const createUser = async (req: any, res: any) => {
  if (req.body) {
    if (
      !req.body.username ||
      !req.body.age ||
      !req.body.hobbies ||
      Object.keys(req.body).length > 3
    ) {
      res.send("Incorrect request data!", 400);
      return;
    }
    let user = req.body;

    if (users.find((item) => item.username === user.username)) {
      res.send("User already exists!", 400);
      return;
    }

    user.id = randomUUID();
    users.push(user);
    res.send(user, 201);
    return;
  }
  res.send("Internal Server Error", 500);
};

//@desc   Get users
//@route  GET /api/users/:id
export const getUser = async (req: IReq, res: any) => {
  if (req.id) {
    let user = users.find((item) => item.id === req.id);
    if (user) {
      res.send(user, 200);
      return;
    }
    res.send("User not found!", 404);
  }
};

//@desc   Update user
//@route  PUT /api/users/:id
export const updateUser = async (req: IReq, res: any) => {
  if (req.id && req.body) {
    if (
      !req.body.username ||
      !req.body.age ||
      !req.body.hobbies ||
      Object.keys(req.body).length > 3
    ) {
      res.send("Incorrect request data!", 400);
      return;
    }
    let user = users.find((item) => item.id === req.id);
    if (user) {
      user.username = req.body.username;
      user.age = req.body.age;
      user.hobbies = req.body.hobbies;
      res.send(user, 200);
      return;
    }
  }
  res.send("User not found!", 404);
};

//@desc   Delete user
//@route  DELETE /api/users/:id
export const deleteUser = async (req: IReq, res: any) => {
  if (req.id) {
    let userIndex = users.findIndex((item) => item.id === req.id);
    if (userIndex !== -1) {
      users.splice(userIndex, 1);
      console.log("deleted");
      res.send("_", 204);
      return;
    }
  }
  res.send("User not found!", 404);
};
