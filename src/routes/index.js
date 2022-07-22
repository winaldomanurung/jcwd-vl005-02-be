const adminProductRouter = require("./admin/products-router");
const adminCategoriesRouter = require("./admin/categories-router");
const adminTransactionRouter = require("./admin/transactions-router");
const adminReportRouter = require("./admin/reports-router");
const adminManageUsersRouter = require("./admin/manage-users-router");
const adminRouter = require("./admin/admin-router");
const user_router = require("./user/user-routers");
const userProductRouter = require("./user/products-router");
const userCartRouter = require("./user/cart-router");
const userCheckoutRouter = require("./user/checkout-router");
const braintreeRouter = require("./user/braintree-router");
const historyRouter = require("./user/history-router");
const addressRouter = require("./user/address-router");

module.exports = {
  adminProductRouter,
  adminCategoriesRouter,
  adminTransactionRouter,
  adminReportRouter,
  adminManageUsersRouter,
  adminRouter,
  user_router,
  userProductRouter,
  userCartRouter,
  userCheckoutRouter,
  braintreeRouter,
  historyRouter,
  addressRouter,
};
