import { assert } from "chai";
import { db } from "../src/models/db.js";
import { longplayer, maggie, testUsers } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";

suite("Place Model tests", () => {

  setup(async () => {
    db.init("mongo");
    await db.placeStore.deleteAll();
  });

  test("create a place", async () => {
    const newPlace = await db.placeStore.addPlace(longplayer);
    console.log(newPlace)
    assertSubset(longplayer, newPlace);
  });

  test("delete a place - fail", async () => {
    const allPlacesPre = await db.placeStore.getAllPlaces();
    await db.placeStore.deletePlaceById("bad-id");
    const allPlacesPost = await db.placeStore.getAllPlaces();
    assert.equal(allPlacesPre.length, allPlacesPost.length);
  });
});
