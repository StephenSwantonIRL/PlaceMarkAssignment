import { v4 } from "uuid";



export const placeMemStore = {
  places: [],
  getAllPlaces() {
    return this.places;
  },

  getUserPlaces(userId) {
    const userPlaces = this.places.filter((place) => place.createdBy === userId);
    return userPlaces
  },

  getOtherUserPlaces(userId) {
    const userPlaces = this.places.filter((place) => place.createdBy !== userId);
    return userPlaces
  },
  async addPlace(place) {
    if (!place.name || !place.location || !place.latitude || !place.longitude || !place.createdBy) {
      return new Error("Incomplete Place Information");
    } else  {
      place._id = v4();
      this.places.push(place);
      return place;
    }
  },

  async getPlaceById(id) {
    return this.places.find((place) => place._id === id);
  },

  async updatePlace(id, updatedPlace) {
    const place = await this.getPlaceById(id);
    place.name = updatedPlace.name;
    place.location = updatedPlace.location;
    place.latitude = updatedPlace.latitude;
    place.longitude = updatedPlace.longitude;
    place.description = updatedPlace.description;
    place.images = updatedPlace.images;
  },


  async deletePlaceById(id, createdBy) {
    const placeInDb = await this.getPlaceById(id);
    if (placeInDb !== undefined) {
      const placeCreatedBy = placeInDb.createdBy;
      if (placeCreatedBy === createdBy) {
        const index = this.places.findIndex((place) => place._id === id);
        this.places.splice(index, 1);
      }
    } else {
      return new Error("No Placemark with that Id");
    }

  },

  async deleteAll() {
    this.places = [];
  },
};

