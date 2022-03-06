import { userApi } from "../api/user-api.js"
import { placeApi } from "../api/place-api.js";

export const apiRoutes = [
  { method: "GET", path: "/api/users", config: userApi.find },
  { method: "POST", path: "/api/users", config: userApi.create },
  { method: "DELETE", path: "/api/users", config: userApi.deleteAll },
  { method: "GET", path: "/api/users/{id}", config: userApi.findOne },

  { method: "POST", path: "/api/placemark", config: placeApi.create },
  { method: "DELETE", path: "/api/placemark", config: placeApi.deleteAll },
  { method: "GET", path: "/api/placemark", config: placeApi.find },
  { method: "GET", path: "/api/placemark/{id}", config: placeApi.findOne },
  { method: "DELETE", path: "/api/placemark/{id}", config: placeApi.deleteOne },

];