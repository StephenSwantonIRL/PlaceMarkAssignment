import { assert } from "chai";
import { placeMarkService } from "./placemark-service.js";
import { db } from "../../src/models/db.js"
import { assertSubset } from "../test-utils.js";

import { longplayer, svalbard, incompleteSvalbard, updatedSvalbard, sealIsland } from "../fixtures.js";

suite("PlaceMark API tests", () => {

  let user = null;

  setup(async () => {
    db.init("mem");
     //await placeMarkService.deleteAllPlaces();
     //svalbard.createdBy = 2234347347;
  });

  teardown(async () => {});

  test("create place", async () => {
    const returnedPlace = await placeMarkService.createPlace(svalbard);
    assert.isNotNull(returnedPlace);
    assertSubset(svalbard, returnedPlace);

  });

  test("return a place", async () => {
    const createdPlace = await placeMarkService.createPlace(svalbard);
    const returnedPlace = await placeMarkService.getPlace(createdPlace._id)
    assert.isNotNull(returnedPlace);
    assertSubset(svalbard, returnedPlace);
  });

  test("attempt to return a non-existent place", async () => {
    try {
      const returnedPlace = await placeMarkService.getPlace("bad-id");
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No PlaceMark with this id", "Incorrect Response Message");
    }
  });

  test("delete a place", async () => {
    const place = await placeMarkService.createPlace(svalbard);
    const response = await placeMarkService.deletePlace(place._id, place.createdBy);
    assert.equal(response.status, 204);
    try {
      const returnedPlace = await placeMarkService.getPlace(place._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No PlaceMark with this id", "Incorrect Response Message");
    }
  });

});
