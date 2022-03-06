
import { placeApi } from "../api/place-api.js";

export const apiRoutes = [

  { method: "POST", path: "/api/placemark", config: placeApi.create },
  { method: "DELETE", path: "/api/placemark", config: placeApi.deleteAll },
  { method: "GET", path: "/api/placemark", config: placeApi.find },
  { method: "GET", path: "/api/placemark/{id}", config: placeApi.findOne },
  { method: "DELETE", path: "/api/placemark/{id}", config: placeApi.deleteOne },

];