import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { svalbard, sealIsland, isolatedPlaces, updatedIsolatedPlaces } from "../fixtures.js";
import { assertSubset, assertObjectinArray } from "../test-utils.js";
import _ from 'lodash';

suite("Category Model tests", () => {

  setup(async () => {
    db.init("json");
    await db.categoryStore.deleteAll();
    await db.placeStore.deleteAll();
    let svalbardInDb = await db.placeStore.addPlace(svalbard);
    svalbard._id = svalbardInDb._id;
  });

  test("create a category", async () => {
    const allCategoriesPre =  await db.categoryStore.getAllCategories();
    assert.isFalse(assertSubset(isolatedPlaces, allCategoriesPre));
    const newCategory = await db.categoryStore.addCategory(isolatedPlaces);
    const allCategoriesPost = await db.categoryStore.getAllCategories();
    assertSubset(isolatedPlaces, allPlacesPost);
    assert.notEqual(allCategoriesPre, allCategoriesPost)
    assert.equal(allCategoriesPost.length, allCategoriesPre + 1)
  });

  test("create a category - failed - no name ", async () => {
    await db.categoryStore.addCategory(blankCategory);
    const allCategories = await db.categoryStore.getAllCategories();
    assert.isFalse(allCategories.includes(blankCategory))
  });

  test("delete a category - fail - bad id ", async () => {
    const allCategoriesPre = await db.categoryStore.getAllCategories();
    const adminUser = true;
    await db.categoryStore.deleteCategoryById("bad-id", adminUser );
    const allCategoriesPost = await db.categoryStore.getAllCategories();
    assert.equal(allCategoriesPre.length, allCategoriesPost.length);
  });

  test("delete a category - fail - not an admin", async () => {
    const categoryToDelete = await db.categoryStore.addCategory(isolatedPlaces);
    const categoryId = categoryToDelete._id;
    const allCategoriesPre =  await db.categoryStore.getAllCategories();
    const adminUser = false;
    await db.categoryStore.deletePlaceById(categoryId, adminUser);
    const allCategoriesPost = await db.categoryStore.getAllCategories();
    assert.equal(allCategoriesPre.length, allCategoriesPost.length);
    const assertion = assertSubset( categoryToDelete, allCategoriesPost);

  });

  test("delete a category - success ", async () => {
    const categoryToDelete = await db.categoryStore.addCategory(isolatedPlaces);
    const allCategoriesPre = await db.categoryStore.getAllCategories();
    const adminUser = true;
    const outcome = await db.categoryStore.deleteCategoryById(categoryToDelete._id, adminUser);
    const allCategoriesPost = await db.categoryStore.getAllCategories();
    assert.notEqual(allCategoriesPre.length, allCategoriesPost.length);
    assert.isFalse(assertSubset(isolatedPlaces, allCategoriesPost));
  });

  test("update a category - success", async () => {
    const category = await db.categoryStore.addCategory(isolatedPlaces);
    isolatedPlaces._id = category._id;
    const adminUser = true;
    assert.deepEqual(category, isolatedPlaces);
    const allCategories = await db.categoryStore.getAllCategories();
    const updatedCategory = updatedIsolatedPlaces;
    updatedCategory._id = category._id;
    await db.categoryStore.updateCategory(category._id, updatedCategory);
    const finalCategory = await db.categoryStore.getCategoryById(category._id);
    const finalCategories = await db.categoryStore.getAllCategories();
    assert.deepEqual(finalCategory, updatedCategory);
    assert.equal(allCategories.length, finalCategories.length)
  });


  test("get places in a category", async () => {
    await db.categoryStore.addPlace(svalbard._id, isolatedPlaces);
    await db.categoryStore.addPlace(sealIsland._id, isolatedPlaces);
    const places =await db.categoryStore.getPlaces(isolatedPlaces);
    assertSubset(svalbard, places);
    assertSubset(sealIsland, places);
    assert.isFalse(assertSubset(longplayer, places));

  });

  test("add a place to a category", async () => {
    const categoryPlacesPre = await db.categoryStore.getPlaces(isolatedPlaces)
    assert.isFalse(assertSubsert(svalbard,categoryPlacesPre));
    await db.categoryStore.addPlace(svalbard._id, isolatedPlaces);
    const categoryPlacesPost = await db.categoryStore.getPlaces(isolatedPlaces);
    assertSubset(svalbard, categoryPlacesPost);
  });



});
