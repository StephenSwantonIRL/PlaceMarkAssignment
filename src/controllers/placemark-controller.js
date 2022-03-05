import { PlaceSpec } from "../models/joi-schemas.js";
import { db } from "../models/db.js";

export const placeController = {
  index: {
    auth: false,
    handler: function (request, h) {
      return h.view("main", { title: "Welcome to Playlist" });
    },
  },
  add: {
    auth: false,
    handler: function (request, h) {
      return h.view("create-place-view", { title: "Create a New PlaceMark" });
    },
  },
};
