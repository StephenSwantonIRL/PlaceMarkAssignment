
import _ from "lodash";
import { db } from "../models/db.js";

export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const userId = request.state.placemark.id
      const myPlaceMarks = await db.placeStore.getUserPlaces(userId);
      const othersPlaceMarks = await db.placeStore.getOtherUserPlaces(userId);
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
        myPlaceMarks: myPlaceMarks,
        othersPlaceMarks: othersPlaceMarks,
      };
      return h.view("dashboard-view", viewData);
    },
  },

  addCategory: {
    handler: async function(request, h) {
      const loggedInUser = request.auth.credentials;
      const userId = request.state.placemark.id
      // to do - amend so that only admins can create new categories
      await db.categoryStore.addCategory(request.payload);
      return h.redirect("/dashboard");
    },
  }

};
