import { assert } from "chai";
import { db } from "../../src/models/db.js";
import { svalbard, sealIsland, isolatedPlaces, updatedIsolatedPlaces, blankCategory } from "../fixtures.js";
import { assertSubset, assertObjectinArray } from "../test-utils.js";
import _ from 'lodash';

suite("Category Model tests", () => {

  setup(async () => {
    db.init("mem");
    await db.categoryStore.deleteAll();
    await db.placeStore.deleteAll();
    const svalbardInDb = await db.placeStore.addPlace(svalbard);
    const sealIslandInDb = await db.placeStore.addPlace(sealIsland);
    svalbard._id = svalbardInDb._id;
    sealIsland._id = sealIslandInDb._id;
  });

  test("create a category", async () => {
    const allCategoriesPre =  await db.categoryStore.getAllCategories();
    assert.isFalse(assertSubset(isolatedPlaces, allCategoriesPre));
    const newCategory = await db.categoryStore.addCategory(isolatedPlaces);
    const allCategoriesPost = await db.categoryStore.getAllCategories();
    assertSubset(isolatedPlaces, allCategoriesPost);
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
    await db.categoryStore.deleteCategoryById(categoryId, adminUser);
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
    const newCategory = await db.categoryStore.addCategory(isolatedPlaces);
    await db.categoryStore.addPlace(svalbard._id, newCategory._id);
    await db.categoryStore.addPlace(sealIsland._id, newCategory._id);
    const places =await db.categoryStore.getPlaces(isolatedPlaces._id);
    assertSubset(svalbard, places);
    assertSubset(sealIsland, places);

  });

  test("add a place to a category", async () => {
    const newCategory = await db.categoryStore.addCategory(isolatedPlaces);
    const categoryPlacesPre = await db.categoryStore.getPlaces(newCategory._id)
    assert.isFalse(assertSubset(svalbard,categoryPlacesPre));
    await db.categoryStore.addPlace(svalbard._id, newCategory._id);
    const categoryPlacesPost = await db.categoryStore.getPlaces(newCategory._id);
    assertSubset(svalbard, categoryPlacesPost);
  });

  test("delete a place from a category", async () => {
    const newCategory = await db.categoryStore.addCategory(isolatedPlaces);
    await db.categoryStore.addPlace(svalbard._id, newCategory._id);
    await db.categoryStore.addPlace(sealIsland._id, newCategory._id);
    const categoryPlacesPre = await db.categoryStore.getPlaces(newCategory._id);
    assertSubset(svalbard, categoryPlacesPre);
    assertSubset(sealIsland, categoryPlacesPre)
    await db.categoryStore.deletePlace(svalbard._id, newCategory._id);
    const categoryPlacesPost = await db.categoryStore.getPlaces(newCategory._id);
    assert.isFalse(assertSubset(svalbard));
  });



});
