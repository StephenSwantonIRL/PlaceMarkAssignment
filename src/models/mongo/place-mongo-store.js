import { Place } from "./place.js";

export const placeMongoStore = {
  async getAllPlaces() {
    const places = await Place.find().lean();
    return places;
  },

  async getPlaceById(id) {
    if (id) {
      const place = await Place.findOne({ _id: id }).lean();
      return place;
    }
    return null;
  },

  async addPlace(place) {
    const newPlace = {};
    newPlace.name = place.name;
    newPlace.location = place.location;
    newPlace.latitude = place.latitude;
    newPlace.longitude = place.longitude;
    newPlace.description = place.description;
    newPlace.images = place.images;
    newPlace.createdBy = place.createdBy;
    const operation = new Place(newPlace);
    const returnedPlace = await operation.save();
    return this.getPlaceById(returnedPlace._id);
  },

  async updatePlace(id, updatedPlace) {
    await Place.updateOne(
      { _id: id },
      {
        name: updatedPlace.name,
        location: updatedPlace.location,
        latitude: updatedPlace.latitude,
        longitude: updatedPlace.longitude,
        description: updatedPlace.description,
        images: updatedPlace.images,
      }
    );
    const amendedPlace = await this.getPlaceById(id);
    return amendedPlace;
  },

  async getUserPlaces(id) {
    const places = await Place.find({ createdBy: id }).lean();
    return places;
  },

  async getOtherUserPlaces(id) {
    const places = await Place.find({ createdBy: { $ne: id } }).lean();
    return places;
  },

  async deletePlaceById(id, createdBy) {
    const placeInDb = await this.getPlaceById(id);
    if (placeInDb === null) {
      return new Error("No Placemark with that Id");
    }
    const placeCreatedBy = placeInDb.createdBy;
    if (JSON.stringify(placeCreatedBy) == JSON.stringify(createdBy)) {
      try {
        await Place.deleteOne({ _id: id });
        return Promise.resolve();
      } catch (error) {
        return new Error("No Placemark with that Id");
      }
    } else {
      return new Error("User not authorised to delete this Placemark");
    }
  },

  async deleteAll() {
    await Place.deleteMany({});
  },
};
