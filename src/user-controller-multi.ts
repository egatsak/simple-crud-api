import { randomUUID } from 'node:crypto';

import { ErrorMessages, HttpException, Req, Res, User } from './models/models';
import { errorHandler } from './helpers/errorHandler';
import fieldsValidator from './helpers/fieldsValidator';

//@desc   Get users
//@route  GET /api/users
export const getUsers = async (req: Req, res: Res, db: User[]) => {
  try {
    res.send(db);
  } catch (e) {
    errorHandler(req, e);
  }
};

//@desc   Create new user
//@route  POST /api/users
export const createUser = async (
  req: Req,
  res: Res,
  db: User[],
  send: (db: User[]) => void,
) => {
  try {
    if (!req.body) {
      throw new HttpException(ErrorMessages.REQ_BODY_MISSING, 400);
    }

    if (Object.keys(req.body).length > 3) {
      throw new HttpException(ErrorMessages.INCORRECT_REQ_DATA, 400);
    }

    const validationErrors = fieldsValidator.validate(
      req.body.username,
      req.body.age,
      req.body.hobbies,
    );

    if (validationErrors.length) {
      throw new HttpException(validationErrors.join(', '), 400);
    }

    const user = req.body;

    if (db.find((item) => item.username === user.username)) {
      throw new HttpException(ErrorMessages.USER_ALREADY_EXISTS, 400);
    }

    user.id = randomUUID();
    db.push(user);
    send(db);
    res.send(user, 201);
  } catch (e) {
    errorHandler(req, e);
  }
};

//@desc   Get user
//@route  GET /api/users/:id
export const getUser = async (req: Req, res: Res, db: User[]) => {
  try {
    if (req.id) {
      const user = db.find((item) => item.id === req.id);
      if (user) {
        res.send(user, 200);
        return;
      } else {
        throw new HttpException(ErrorMessages.USER_NOT_FOUND, 404);
      }
    }
  } catch (e) {
    errorHandler(req, e);
  }
};

//@desc   Update user
//@route  PUT /api/users/:id
export const updateUser = async (
  req: Req,
  res: Res,
  db: User[],
  send: (db: User[]) => void,
) => {
  try {
    if (!req.body) {
      throw new HttpException(ErrorMessages.REQ_BODY_MISSING, 400);
    }
    if (!req.id) {
      throw new HttpException(ErrorMessages.MISSING_URL_ID, 400);
    }

    if (Object.keys(req.body).length > 3) {
      throw new HttpException(ErrorMessages.INCORRECT_REQ_DATA, 400);
    }

    const validationErrors = fieldsValidator.validate(
      req.body.username,
      req.body.age,
      req.body.hobbies,
    );

    if (validationErrors.length) {
      throw new HttpException(validationErrors.join(', '), 400);
    }

    const user = db.find((item) => item.id === req.id);

    if (!user) {
      throw new HttpException(ErrorMessages.USER_NOT_FOUND, 404);
    }

    user.username = req.body.username;
    user.age = req.body.age;
    user.hobbies = req.body.hobbies;

    send(db);
    res.send(user, 200);
  } catch (e) {
    errorHandler(req, e);
  }
};

//@desc   Delete user
//@route  DELETE /api/users/:id
export const deleteUser = async (
  req: Req,
  res: Res,
  db: User[],
  send: (db: User[]) => void,
) => {
  try {
    if (!req.id) {
      throw new HttpException(ErrorMessages.MISSING_URL_ID, 400);
    }

    const userIndex = db.findIndex((item) => item.id === req.id);

    if (userIndex === -1) {
      throw new HttpException(ErrorMessages.USER_NOT_FOUND, 404);
    }

    db.splice(userIndex, 1);
    send(db);
    res.send('_', 204);
  } catch (e) {
    errorHandler(req, e);
  }
};
