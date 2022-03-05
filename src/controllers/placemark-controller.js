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
    handler: function (request, h) {
      return h.view("create-place-view", { title: "Create a New PlaceMark" });
    },
  },
  save: {
    validate: {
      payload: PlaceSpec,
      options: { abortEarly: false },
      failAction: function (request, h, error) {
        console.log(error.details);
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: error.details }).takeover().code(400);
      },
    },
    handler: async function (request, h) {
      const place = request.payload;
      place.createdBy = request.state.placemark.id;
      const addPlace = await db.placeStore.addPlace(place);
      if (addPlace.message) {
        const errorDetails = [{ message: addPlace.message }];
        return h.view("edit-place-view", { title: "Error Saving PlaceMark", errors: errorDetails }).takeover().code(400);
      }
      return h.view("edit-place-view", { title: addPlace.name, "place": addPlace });
    },
  },
};
