import { assert } from "chai";
import { placeMarkService } from "./placemark-service.js";
import { assertSubset } from "../test-utils.js";

import { longplayer, svalbard, incompleteSvalbard, updatedSvalbard, sealIsland } from "../fixtures.js";

suite("PlaceMark API tests", () => {

  let user = null;

  setup(async () => {
    // await placeMarkService.deleteAllPlaces();
    // await placeMarkService.deleteAllUsers();
    // user = await placeMarkService.createUser(maggie);
    // svalbard.createdBy = user._id;
  });

  teardown(async () => {});

  test("create place", async () => {
    const returnedPlace = await placeMarkService.createPlace(svalbard);
    assert.isNotNull(returnedPlace);
    assertSubset(svalbard, returnedPlace);
  });

  test("delete a place", async () => {
    const place = await placeMarkService.createPlace(svalbard);
    const response = await placeMarkService.deletePlace(place._id);
    assert.equal(response.status, 204);
    try {
      const returnedPlace = await placeMarkService.getPlace(place._id);
      assert.fail("Should not return a response");
    } catch (error) {
      assert(error.response.data.message === "No PlaceMark with this id", "Incorrect Response Message");
    }
  });

});
