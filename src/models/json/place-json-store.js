import { v4 } from "uuid";
// eslint-disable-next-line import/no-unresolved
import { JSONFile, Low } from "lowdb";

const db = new Low(new JSONFile("./src/models/json/places.json"));
db.data = { playlists: [] };

export const placeJsonStore = {
};
