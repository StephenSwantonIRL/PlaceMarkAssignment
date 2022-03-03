import { assert } from "chai";
import { db } from "../src/models/db.js";
import { longplayer, maggie, testUsers } from "./fixtures.js";
import { assertSubset } from "./test-utils.js";

suite("Place Model tests", () => {

  setup(async () => {
    db.init("mem");
    await db.placeStore.deleteAll();
  });

  test("create a place", async () => {
    const allPlacesPre = await db.placeStore.getAllPlaces();
    assert.isFalse(assertSubset(longplayer, allPlacesPre));
    const newPlace = await db.placeStore.addPlace(longplayer);
    const allPlacesPost = await db.placeStore.getAllPlaces();
    console.log(newPlace);
    assertSubset(longplayer, allPlacesPost);
  });

  test("delete a place - fail", async () => {
    const allPlacesPre = await db.placeStore.getAllPlaces();
    await db.placeStore.deletePlaceById("bad-id");
    const allPlacesPost = await db.placeStore.getAllPlaces();
    assert.equal(allPlacesPre.length, allPlacesPost.length);
  });
});
