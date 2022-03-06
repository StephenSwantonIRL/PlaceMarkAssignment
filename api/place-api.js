import Boom from "@hapi/boom";
import { db } from "../src/models/db.js";

export const placeApi = {
  find: {
    auth: false,
    handler: async function(request, h) {
      try {
        const places = await db.placeStore.getAllPlaces();
        return places;
      } catch (err) {
        return Boom.serverUnavailable("Database Error");
      }
    },
  },

  findOne: {
    auth: false,
    handler: async function(request, h) {
      try {
        const place = await db.placeStore.getPlaceById(request.params.id);
        if (!place) {
          return Boom.notFound("No User with this id");
        }
        return place;
      } catch (err) {
        return Boom.serverUnavailable("No User with this id");
      }
    },
  },
};
