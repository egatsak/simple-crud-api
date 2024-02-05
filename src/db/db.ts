import { User } from '../models/models';

class Database {
  users: User[];
  constructor(users: User[] = []) {
    this.users = users;
  }
}

export default new Database();
