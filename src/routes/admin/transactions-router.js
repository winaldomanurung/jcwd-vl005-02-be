// const router = require("express").Router();
const express = require("express");
const router = express.Router();
// import transactions controller
const { adminTransactionContoller } = require("../../controllers");

// define route
router.get("/transaction", adminTransactionContoller.getAllTransactions);
router.get("/transaction/:id", adminTransactionContoller.getTransactionPayment);
router.post(
  "/transactiondaterange",
  adminTransactionContoller.TransactionsByDateRange
);
router.post(
  "/transactionbymonth",
  adminTransactionContoller.TransactionsByMonth
);
router.patch(
  "/change-transaction-status-approved",
  adminTransactionContoller.ChangeTransactionsStatusApproved
);
router.patch(
  "/change-transaction-status-rejected",
  adminTransactionContoller.ChangeTransactionsStatusRejected
);

module.exports = router;
