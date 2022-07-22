// const router = require("express").Router();
const express = require("express");
const router = express.Router();
// import transactions controller
const {adminManageUsersController} = require("../../controllers")

// define route
router.get("/users",adminManageUsersController.manageusers)

// router.post("/transactiondaterange",adminTransactionContoller.TransactionsByDateRange)
// router.post("/transactionbymonth",adminTransactionContoller.TransactionsByMonth)
router.patch("/changeuserstatus",adminManageUsersController.changeusersisactive)

module.exports = router;