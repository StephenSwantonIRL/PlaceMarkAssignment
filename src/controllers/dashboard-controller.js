import mongoose from "mongoose";
import { db } from "../models/db.js";
import { userMongoStore } from "../models/mongo/user-mongo-store.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      let userId
      if( db.userStore === userMongoStore) {
        userId = mongoose.Types.ObjectId(request.state.placemark.id)
      } else {
        userId = request.state.placemark.id
      }
      const isAdmin = await db.userStore.checkAdmin(userId);
      const myPlaceMarks = await db.placeStore.getUserPlaces(userId);
      const othersPlaceMarks = await db.placeStore.getOtherUserPlaces(userId);
      const categories = await db.categoryStore.getAllCategories();
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        myPlaceMarks: myPlaceMarks,
        othersPlaceMarks: othersPlaceMarks,
        categories: categories,
        isAdmin: isAdmin,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  admin: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const userId = request.state.placemark.id
      const isAdmin = await db.userStore.checkAdmin(userId);
      const users = await db.userStore.getAllUsers();
      if(isAdmin === false){
        return h.redirect("/dashboard");
      }
      const categories = await db.categoryStore.getAllCategories();
      const viewData = {
        title: "Admin Dashboard",
        user: loggedInUser,
        categories: categories,
        isAdmin: isAdmin,
        users: users,
      };
      return h.view("admin-view", viewData);
    },
  },

  deleteUser: {
    handler: async function(request, h) {
      const userId = request.state.placemark.id
      const isAdmin = await db.userStore.checkAdmin(userId);
      if(isAdmin === false){
        return h.redirect("/dashboard");
      }
      const userToDelete = request.params.id;
      const outcome = await db.userStore.deleteUserById(userToDelete);
      return h.redirect("/admin")
    }
  },

  makeAdmin: {
    handler: async function(request, h) {
      const userId = request.state.placemark.id
      const isAdmin = await db.userStore.checkAdmin(userId);
      if(isAdmin === false){
        return h.redirect("/dashboard");
      }
      const newAdmin = request.params.id;
      const outcome = await db.userStore.makeAdmin(newAdmin);
      return h.redirect("/admin")
    }
  },

  revokeAdmin: {
    handler: async function(request, h) {
      const userId = request.state.placemark.id
      const isAdmin = await db.userStore.checkAdmin(userId);
      if(isAdmin === false){
        return h.redirect("/dashboard");
      }
      const revokedUser = request.params.id;
      const outcome = await db.userStore.revokeAdmin(revokedUser);
      return h.redirect("/admin")
    }
  },

  addCategory: {
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      const userId = request.state.placemark.id
      // to do - amend so that only admins can create new categories
      await db.categoryStore.addCategory(request.payload);
      return h.redirect("/admin");
    },
  },

  deleteCategory: {
    handler: async function(request, h) {
      const categoryId = request.params.id;
      const outcome = await db.categoryStore.deleteCategoryById(categoryId, true);
      return h.redirect("/admin")
    }
  },

  editCategory: {
    handler: async function(request, h) {
      const categoryId = request.params.id;
      const outcome = await db.categoryStore.updateCategory(categoryId, request.payload);
      return h.redirect("/admin")
    }
  }

};
