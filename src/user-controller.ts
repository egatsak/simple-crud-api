import {
  ErrorMessages,
  HttpException,
  Req,
  Res,
  UserDto,
} from './models/models';

import { errorHandler } from './helpers/errorHandler';
import fieldsValidator from './helpers/fieldsValidator';

import { UserService } from './user-service';

//@desc   Get users
//@route  GET /api/users
export const getUsers = async (req: Req, res: Res) => {
  try {
    const users = UserService.getUsers();
    res.send(users);
  } catch (error) {
    errorHandler(req, error);
  }
};

//@desc   Create new user
//@route  POST /api/users
export const createUser = (req: Req, res: Res) => {
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

    const userDto = req.body as UserDto;

    const newUser = UserService.createUser(userDto);

    res.send(newUser, 201);
  } catch (error) {
    errorHandler(req, error);
  }
};

//@desc   Get user
//@route  GET /api/users/:id
export const getUser = (req: Req, res: Res) => {
  try {
    if (req.id) {
      const user = UserService.getUserById(req.id);

      if (!user) {
        throw new HttpException(ErrorMessages.USER_NOT_FOUND, 404);
      }

      res.send(user, 200);
    }
  } catch (error) {
    errorHandler(req, error);
  }
};

//@desc   Update user
//@route  PUT /api/users/:id
export const updateUser = (req: Req, res: Res) => {
  try {
    if (!req.id) {
      throw new HttpException(ErrorMessages.MISSING_URL_ID, 400);
    }

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

    const user = UserService.updateUser(req.id, req.body);

    if (!user) {
      throw new HttpException(ErrorMessages.USER_NOT_FOUND, 404);
    }

    res.send(user, 200);
  } catch (error) {
    errorHandler(req, error);
  }
};

//@desc   Delete user
//@route  DELETE /api/users/:id
export const deleteUser = (req: Req, res: Res) => {
  try {
    if (!req.id) {
      throw new HttpException(ErrorMessages.MISSING_URL_ID, 400);
    }

    UserService.deleteUser(req.id);

    res.send('_', 204);
  } catch (error) {
    errorHandler(req, error);
  }
};
