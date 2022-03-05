import { assert } from "chai";
import { db } from "../src/models/db.js";
import { longplayer, svalbard, incompleteSvalbard, updatedSvalbard } from "./fixtures.js";
import { assertSubset, assertObjectinArray } from "./test-utils.js";
import _ from 'lodash';

suite("Place Model tests", () => {

  setup(async () => {
    db.init("mem");
    await db.placeStore.deleteAll();
  });

  test("create a place", async () => {
    const allPlacesPre =  await _.clone(db.placeStore.getAllPlaces());
    assert.isFalse(assertSubset(longplayer, allPlacesPre));
    const newPlace = await db.placeStore.addPlace(longplayer);
    const allPlacesPost = await _.clone(db.placeStore.getAllPlaces());
    assertSubset(longplayer, allPlacesPost);
    assert.notEqual(allPlacesPre, allPlacesPost)
    assert.equal(allPlacesPost.length, allPlacesPre + 1)
  });

  test("create a place - failed - missing required parameter ", async () => {
    await db.placeStore.addPlace(incompleteSvalbard);
    const allPlaces = await _.clone(db.placeStore.getAllPlaces());
    assert.isFalse(allPlaces.includes(incompleteSvalbard))
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
    const allPlacesPre =  await _.clone(db.placeStore.getAllPlaces());
    const currentUser = "125634"
    await db.placeStore.deletePlaceById(placeId, currentUser);
    const allPlacesPost = await _.clone(db.placeStore.getAllPlaces());
    assert.equal(allPlacesPre.length, allPlacesPost.length);
    const assertion = assertSubset( placeToDelete, allPlacesPost);

  });

  test("delete a place - success ", async () => {
    const placeToDelete = await db.placeStore.addPlace(longplayer);
    const allPlacesPre = await _.clone(db.placeStore.getAllPlaces());
    const currentUserId = placeToDelete.createdBy;
    await db.placeStore.deletePlaceById(placeToDelete._id, currentUserId);
    const allPlacesPost = await _.clone(db.placeStore.getAllPlaces());
    assert.notEqual(allPlacesPre.length, allPlacesPost.length);
    assert.isFalse(assertSubset(longplayer, allPlacesPost));
  });

  test("update a place - success", async () => {
    const place = await db.placeStore.addPlace(svalbard);
    svalbard._id = place._id;
    const editor = place.createdBy
    assert.deepEqual(place, svalbard);
    const allPlaces = await _.clone(db.placeStore.getAllPlaces());
    const updatedPlace = updatedSvalbard;
    updatedPlace._id = place._id;
    await db.placeStore.updatePlace(place._id, updatedPlace);
    const finalPlace = await db.placeStore.getPlaceById(place._id);
    const finalPlaces = await _.clone(db.placeStore.getAllPlaces());
    assert.deepEqual(finalPlace, updatedPlace);
    assert.equal(allPlaces.length, finalPlaces.length)
  });


  test("get all places created by a specific user", async () => {
    await db.placeStore.addPlace(longplayer)
    const place = await db.placeStore.addPlace(svalbard)
    const allPlaces = await _.clone(db.placeStore.getAllPlaces())
    const userId = 1223355634
    const usersPlaces = await db.placeStore.getUserPlaces(userId);
    assertSubset(svalbard, usersPlaces);
    assert.notEqual(usersPlaces.length, allPlaces.length)

  });



});
