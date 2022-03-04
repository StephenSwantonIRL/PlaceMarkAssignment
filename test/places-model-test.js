import { assert } from "chai";
import { db } from "../src/models/db.js";
import { longplayer, svalbard, incompleteSvalbard, updatedSvalbard } from "./fixtures.js";
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
    assertSubset(longplayer, allPlacesPost);
  });

  test("create a place - failed - missing required parameter ", async () => {
    await db.placeStore.addPlace(incompleteSvalbard);
    const allPlaces = await db.placeStore.getAllPlaces();
    assert.isFalse(assertSubset(incompleteSvalbard, allPlaces));
  });

  test("delete a place - fail - bad id ", async () => {
    const allPlacesPre = await db.placeStore.getAllPlaces();
    await db.placeStore.deletePlaceById("bad-id", "user");
    const allPlacesPost = await db.placeStore.getAllPlaces();
    assert.equal(allPlacesPre.length, allPlacesPost.length);
  });

  test("delete a place - fail - not created by current user", async () => {
    const placeToDelete = await db.placeStore.addPlace(svalbard);
    const placeId = placeToDelete._id;
    const allPlacesPre = await db.placeStore.getAllPlaces();
    const currentUser = "125634"
    await db.placeStore.deletePlaceById(placeId, currentUser);
    const allPlacesPost = await db.placeStore.getAllPlaces();
    assert.equal(allPlacesPre.length, allPlacesPost.length);
    assertSubset( placeToDelete, allPlacesPost);
  });

  test("delete a place - success ", async () => {
    const placeToDelete = await db.placeStore.addPlace(longplayer);
    const allPlacesPre = await db.placeStore.getAllPlaces();
    const currentUserId = placeToDelete.createdBy;
    await db.placeStore.deletePlaceById(placeToDelete._id, currentUserId);
    const allPlacesPost = await db.placeStore.getAllPlaces();
    assert.equal(allPlacesPre.length, allPlacesPost.length);
    assert.isFalse(assertSubset(longplayer, allPlacesPost));
  });

  test("update a place - success", async () => {
    const place = await db.placeStore.addPlace(svalbard);
    svalbard._id = place._id;
    const editor = place.createdBy
    assert.deepEqual(place, svalbard);
    const updatedPlace = updatedSvalbard;
    updatedPlace._id = place._id;
    await db.placeStore.updatePlace(place._id, updatedPlace);
    const finalPlace = await db.placeStore.getPlaceById(place._id);
    assert.deepEqual(finalPlace, updatedPlace);
  });

});
