const adminProductRouter = require("./admin/products-router");
const adminCategoriesRouter = require("./admin/categories-router");
const adminTransactionRouter = require("./admin/transactions-router")
const adminReportRouter = require("./admin/reports-router")
const user_router = require("./user/user-routers");
const userProductRouter = require("./user/products-router");
const userCartRouter = require("./user/cart-router");
const userCheckoutRouter = require("./user/checkout-router");
const braintreeRouter = require("./user/braintree-router");
const historyRouter = require("./user/history-router");

module.exports = {
  adminProductRouter,
  adminCategoriesRouter,
  adminTransactionRouter,
  adminReportRouter,
  user_router,
  userProductRouter,
  userCartRouter,
  
  userCheckoutRouter,
  braintreeRouter,
  historyRouter,
};
