const adminProductController = require("./admin/product-controller");
const adminCategoryController = require("./admin/category-controller");
const user = require("../controllers/user/user-controller");
const userProductController = require("./user/product-controller");

module.exports = {
  adminProductController,
  adminCategoryController,
  user,
  userProductController,
};
