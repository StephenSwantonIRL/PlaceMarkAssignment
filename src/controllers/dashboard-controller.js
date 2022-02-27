
import { db } from "../models/db.js";


export const dashboardController = {
  index: {
    handler: async function (request, h) {
      const loggedInUser = request.auth.credentials;
      const viewData = {
        title: "Playtime Dashboard",
        user: loggedInUser,
      };
      return h.view("dashboard-view", viewData);
    },
  }

};
