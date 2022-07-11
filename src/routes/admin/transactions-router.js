// const router = require("express").Router();
const express = require("express");
const router = express.Router();
// import transactions controller
const {adminTransactionContoller} = require("../../controllers")

// define route
router.get("/transaction",adminTransactionContoller.getAllTransactions)
router.post("/transactiondaterange",adminTransactionContoller.TransactionsByDateRange)
router.post("/transactionbymonth",adminTransactionContoller.TransactionsByMonth)
router.patch("/changetransactionstatus",adminTransactionContoller.ChangeTransactionsStatus)

module.exports = router;
