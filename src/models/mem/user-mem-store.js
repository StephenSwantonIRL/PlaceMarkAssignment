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

  async updateUser(userId, updatedUser) {
    const user = await this.getUserById(userId)
    if (user !== undefined) {
      user.firstName = updatedUser.firstName
      user.lastName = updatedUser.lastName;
      if (user.email !== updatedUser.email) {
        const updatedEmailInDb = await this.getUserByEmail(updatedUser.email)
        if (updatedEmailInDb === undefined) {
          user.email = updatedUser.email;

        } else {
          return new Error("Another user is already using that email address")
        }
      }
      user.password = updatedUser.password;
      users.push(user);
      return user;

    } else {
      return new Error("User does not exist")
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
