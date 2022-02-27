import { userMemStore } from "./mem/user-mem-store.js";
import { placeMemStore } from "./mem/place-mem-store.js";

export const db = {
  userStore: null,
  placeStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.placeStore = placeJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.placeStore = placeMongoStore;
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        this.placeStore = placeMemStore;
    }
  }
};
