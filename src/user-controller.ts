import { randomUUID } from "crypto";
import { users } from "..";
import { IReq } from "../framework/Application";
import { serverErrorHandler } from "./helpers/errorHandler";
import fieldsValidator from "./helpers/fieldsValidator";

//@desc   Get users
//@route  GET /api/users
export const getUsers = async (req: IReq, res: any) => {
  try {
    res.send(users);
  } catch (e) {
    serverErrorHandler(req, "Internal Server Error", 500, e);
  }
};

//@desc   Create new user
//@route  POST /api/users
export const createUser = async (req: any, res: any) => {
  try {
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

      const errors = fieldsValidator.validate(
        req.body.username,
        req.body.age,
        req.body.hobbies
      );

      if (errors.length) {
        res.send(errors.join(", ") + "!", 400);
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
    } else {
      res.send("Request error! Please check request body...", 400);
    }
  } catch (e) {
    serverErrorHandler(req, "Internal Server Error", 500, e);
  }
};

//@desc   Get user
//@route  GET /api/users/:id
export const getUser = async (req: IReq, res: any) => {
  try {
    if (req.id) {
      let user = users.find((item) => item.id === req.id);
      if (user) {
        res.send(user, 200);
        return;
      } else {
        res.send("User not found!", 404);
      }
    }
  } catch (e) {
    serverErrorHandler(req, "Internal Server Error", 500, e);
  }
};

//@desc   Update user
//@route  PUT /api/users/:id
export const updateUser = async (req: IReq, res: any) => {
  try {
    if (req.body) {
      if (req.id) {
        if (
          !req.body.username ||
          !req.body.age ||
          !req.body.hobbies ||
          Object.keys(req.body).length > 3
        ) {
          res.send("Incorrect request data!", 400);
          return;
        }

        const errors = fieldsValidator.validate(
          req.body.username,
          req.body.age,
          req.body.hobbies
        );

        if (errors.length) {
          res.send(errors.join(", " + "!"), 400);
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
      return;
    } else {
      res.send("Request error! Please check request body...", 400);
    }
  } catch (e) {
    serverErrorHandler(req, "Internal Server Error", 500, e);
  }
};

//@desc   Delete user
//@route  DELETE /api/users/:id
export const deleteUser = async (req: IReq, res: any) => {
  try {
    if (req.id) {
      let userIndex = users.findIndex((item) => item.id === req.id);
      if (userIndex !== -1) {
        users.splice(userIndex, 1);
        console.log("deleted");
        res.send("_", 204);
        return;
      }
    } else {
      res.send("User not found!", 404);
    }
  } catch (e) {
    serverErrorHandler(req, "Internal Server Error", 500, e);
  }
};
