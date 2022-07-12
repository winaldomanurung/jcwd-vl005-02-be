// const router = require("express").Router();
const express = require("express");
const router = express.Router();
// import transactions controller
const {adminReportController} = require("../../controllers")

// define route
router.get("/report",adminReportController.reports)
router.get("/top3",adminReportController.topthree)
// router.post("/transactiondaterange",adminTransactionContoller.TransactionsByDateRange)
// router.post("/transactionbymonth",adminTransactionContoller.TransactionsByMonth)
// router.patch("/changetransactionstatus",adminTransactionContoller.ChangeTransactionsStatus)

module.exports = router;