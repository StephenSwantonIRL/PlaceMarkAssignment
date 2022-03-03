/* eslint-disable no-else-return */
import { v4 } from "uuid";

let users = [];

export const userMemStore = {
  async getAllUsers() {
    return users;
  },

  async addUser(user) {
    const userInDb = await this.getUserByEmail(user.email)
    if ((!user.firstName) || (!user.lastName) || (!user.email) || (!user.password)){
      return new Error("Incomplete User Information");
    } else if (userInDb === undefined){
      user._id = v4();
      users.push(user);
      return user;
    } else {
      // eslint-disable-next-line no-throw-literal
      return new Error("User Already Exists");
    }

  },

  async getUserById(id) {
    return users.find((user) => user._id === id);
  },

  async getUserByEmail(email) {
    return users.find((user) => user.email === email);
  },

  async deleteUserById(id) {
    const index = users.findIndex((user) => user._id === id);
    users.splice(index, 1);
  },

  async deleteAll() {
    users = [];
  },
};
