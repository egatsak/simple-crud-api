import { randomUUID } from "crypto";
import { users } from "..";
import { IReq } from "../framework/Application";
import { IUser } from "../models/models";

//@desc   Get users
//@route  GET /api/exercises
export const getUsers = async (req: IReq, res: any) => {
  /* if (req.params) {
        users = await findById(req.params.id); 
  } else {
        users = await find(); 
  } */
  res.send(users);
};

//@desc   Create new user
//@route  GET /api/exercises
export const createUser = async (req: any, res: any) => {
  console.log(req.body);

  let user;
  if (req.body) {
    user = req.body;
    user.id = randomUUID();
    users.push(user);
  }
  res.send(user, 201);
};

//@desc   Get users
//@route  GET /api/exercises
export const getUser = async (req: IReq, res: any) => {
  if (req.id) {
  }
  res.send(users);
};
