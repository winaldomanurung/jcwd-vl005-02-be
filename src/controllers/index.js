const adminProductController = require("./admin/product-controller");
const adminCategoryController = require("./admin/category-controller");
const user = require("../controllers/user/user-controller");
const userProductController = require("./user/product-controller");
const userCartController = require("./user/cart-controller");
const userCheckoutController = require("./user/checkout-controller");

module.exports = {
  adminProductController,
  adminCategoryController,
  user,
  userProductController,
  userCartController,
  userCheckoutController,
};
