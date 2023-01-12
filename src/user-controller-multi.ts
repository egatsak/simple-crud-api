import { randomUUID } from "crypto";

import { ErrorMessages, IReq, IRes, IUser } from "./models/models";
import { errorHandler } from "./helpers/errorHandler";
import fieldsValidator from "./helpers/fieldsValidator";

//@desc   Get users
//@route  GET /api/users
export const getUsers = async (req: IReq, res: IRes, db: IUser[]) => {
  try {
    res.send(db);
  } catch (e) {
    errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500, e);
  }
};

//@desc   Create new user
//@route  POST /api/users
export const createUser = async (
  req: IReq,
  res: IRes,
  db: IUser[],
  send: (db: IUser[]) => {}
) => {
  try {
    if (req.body) {
      if (Object.keys(req.body).length > 3) {
        errorHandler(req, ErrorMessages.INCORRECT_REQ_DATA, 400);
        return;
      }

      const errors = fieldsValidator.validate(
        req.body.username,
        req.body.age,
        req.body.hobbies
      );

      if (errors.length) {
        errorHandler(req, errors.join(", ") + "!", 400);
        return;
      }

      let user = req.body;

      if (db.find((item) => item.username === user.username)) {
        errorHandler(req, ErrorMessages.USER_ALREADY_EXISTS, 400);
        return;
      }

      user.id = randomUUID();
      db.push(user);
      send(db);
      res.send(user, 201);
      return;
    } else {
      errorHandler(req, ErrorMessages.REQ_BODY_MISSING, 400);
    }
  } catch (e) {
    errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500, e);
  }
};

//@desc   Get user
//@route  GET /api/users/:id
export const getUser = async (req: IReq, res: IRes, db: IUser[]) => {
  try {
    if (req.id) {
      let user = db.find((item) => item.id === req.id);
      if (user) {
        res.send(user, 200);
        return;
      } else {
        errorHandler(req, ErrorMessages.USER_NOT_FOUND, 404);
      }
    }
  } catch (e) {
    errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500, e);
  }
};

//@desc   Update user
//@route  PUT /api/users/:id
export const updateUser = async (
  req: IReq,
  res: IRes,
  db: IUser[],
  send: (db: IUser[]) => {}
) => {
  try {
    if (req.body) {
      if (!req.id) {
        errorHandler(req, ErrorMessages.MISSING_URL_ID, 400);
        return;
      }

      if (req.id) {
        let user = db.find((item) => item.id === req.id);

        if (!user) {
          errorHandler(req, ErrorMessages.USER_NOT_FOUND, 404);
          return;
        }

        if (Object.keys(req.body).length > 3) {
          errorHandler(req, ErrorMessages.INCORRECT_REQ_DATA, 400);
          return;
        }

        const errors = fieldsValidator.validate(
          req.body.username,
          req.body.age,
          req.body.hobbies
        );

        if (errors.length) {
          errorHandler(req, errors.join(", ") + "!", 400);
          return;
        }

        user.username = req.body.username;
        user.age = req.body.age;
        user.hobbies = req.body.hobbies;
        send(db);
        res.send(user, 200);
        return;
      }
      errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500);
      return;
    } else {
      errorHandler(req, ErrorMessages.REQ_BODY_MISSING, 400);
    }
  } catch (e) {
    errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500, e);
  }
};

//@desc   Delete user
//@route  DELETE /api/users/:id
export const deleteUser = async (
  req: IReq,
  res: IRes,
  db: IUser[],
  send: (db: IUser[]) => {}
) => {
  try {
    if (!req.id) {
      errorHandler(req, ErrorMessages.MISSING_URL_ID, 400);
      return;
    }

    if (req.id) {
      let userIndex = db.findIndex((item) => item.id === req.id);

      if (userIndex === -1) {
        errorHandler(req, ErrorMessages.USER_NOT_FOUND, 404);
        return;
      }

      db.splice(userIndex, 1);
      send(db);
      res.send("_", 204);
    } else {
      errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500);
    }
  } catch (e) {
    errorHandler(req, ErrorMessages.INT_SERVER_ERROR, 500, e);
  }
};
