import { randomUUID } from 'node:crypto';
import database from './db/db';
import { ErrorMessages, HttpException, User, UserDto } from './models/models';

export class UserService {
  static getUsers() {
    return database.users;
  }

  static createUser(userDto: UserDto) {
    const username = userDto.username;

    if (database.users.find((item) => item.username === username)) {
      throw new HttpException(ErrorMessages.USER_ALREADY_EXISTS, 400);
    }

    const user: User = { ...userDto, id: randomUUID() };
    database.users.push(user);

    return user;
  }

  static getUserById(id: string) {
    return database.users.find((item) => item.id === id);
  }

  static updateUser(id: string, userDto: UserDto) {
    const user = database.users.find((item) => item.id === id);

    if (!user) {
      return null;
    }

    user.username = userDto.username;
    user.age = userDto.age;
    user.hobbies = userDto.hobbies;

    return user;
  }

  static deleteUser(id: string) {
    const userIndex = database.users.findIndex((item) => item.id === id);

    if (userIndex === -1) {
      throw new HttpException(ErrorMessages.USER_ALREADY_EXISTS, 404);
    }

    database.users.splice(userIndex, 1);
  }
}
