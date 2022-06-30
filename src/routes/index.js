const adminProductRouter = require("./admin/products-router");
const adminCategoriesRouter = require("./admin/categories-router");
const user_router = require("./user/user-routers");
const userProductRouter = require("./user/products-router");
const userCartRouter = require("./user/cart-router");

module.exports = {
  adminProductRouter,
  adminCategoriesRouter,
  user_router,
  userProductRouter,
  userCartRouter,
};
