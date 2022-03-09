import { db } from "../db.js";
import { v4 } from "uuid";
import _ from "lodash";

export const categoryMemStore = {
  categories: [],
  getAllCategories() {
    return _.clone(this.categories);
  },

  async addCategory(category) {
    if (!category.name ) {
      return new Error("Incomplete Category Information");
    } else  {
      category._id = v4();
      category.places = [];
      this.categories.push(category);
      return category;
    }
  },

  async addPlace(placeId, categoryId) {
    if (!placeId || !categoryId ) {
      return new Error("Incomplete information provided");
    } else {
      const category = await this.getCategoryById(categoryId)
      const place = await db.placeStore.getPlaceById(placeId)
      if (category === null || place === null) {
        return new Error("Unable to find Category or Place")
      } else {
        category.places.push(placeId);
        return category;
      }
    }
  },

  async getPlaces(categoryId){
    const category = await this.getCategoryById(categoryId);
    console.log(category.places)
    const p = []
    for (let i=0; i < category.places.length; i++){
      // eslint-disable-next-line no-await-in-loop
      let pl = await db.placeStore.getPlaceById(category.places[i]);
      p.push(pl);
    }
    return p;
  },

  async getCategoryById(id) {
    let returnedCategory = this.categories.find((category) => category._id === id);
    if (returnedCategory === undefined) {
      returnedCategory = null;
    }
    return returnedCategory;



  },

  async updateCategory(id, updatedCategory) {
    let category = await this.getCategoryById(id);
    console.log(category[0])
    category.name = updatedCategory.name;
    console.log(category)
    return category
  },


  async deleteCategoryById(id, isAdmin) {
    const categoryInDb = await this.getCategoryById(id);
    if (categoryInDb !== null && isAdmin === true) {
      const index = this.categories.findIndex((category) => category._id === id);
      this.categories.splice(index, 1);
      } else {
      return new Error("Unable to complete request. Please ensure valid Category Id and Administrator");
    }

  },

  async deleteAll() {
    this.categories = [];
  },
};

