import { userMemStore } from "./mem/user-mem-store.js";
import { userJsonStore } from "./json/user-json-store.js";
import { userMongoStore} from "./mongo/user-mongo-store.js";
import { placeJsonStore } from "./json/place-json-store.js";
import { placeMemStore } from "./mem/place-mem-store.js";
import { placeMongoStore } from "./mongo/place-mongo-store.js";
import { categoryMemStore } from "./mem/category-mem-store.js";
import { categoryJsonStore } from "./json/category-json-store.js";
import { connectMongo } from "./mongo/connect.js";

export const db = {
  userStore: null,
  placeStore: null,
  categoryStore: null,

  init(storeType) {
    switch (storeType) {
      case "json" :
        this.userStore = userJsonStore;
        this.placeStore = placeJsonStore;
        this.categoryStore = categoryJsonStore;
        break;
      case "mongo" :
        this.userStore = userMongoStore;
        this.placeStore = placeMongoStore;
        this.categoryStore = categoryJsonStore;
        connectMongo();
        break;
      default :
        this.userStore = userMemStore;
        this.placeStore = placeMemStore;
        this.categoryStore = categoryMemStore;
    }
  }
};
