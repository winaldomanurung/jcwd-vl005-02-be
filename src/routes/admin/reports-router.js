// const router = require("express").Router();
const express = require("express");
const router = express.Router();
// import report controller
const {adminReportController} = require("../../controllers")

// define route
router.get("/report",adminReportController.reports)
router.post("/getreportbydate",adminReportController.getreportbydate)
router.post("/getreportbymonth",adminReportController.getreportbymonth)
router.post("/getreportbyyear",adminReportController.getreportbyyear)


module.exports = router;