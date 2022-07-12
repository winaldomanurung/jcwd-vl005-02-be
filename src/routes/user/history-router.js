const express = require("express");
const router = express.Router();
const auth = require("../../helpers/authorization-token");

const { userHistoryController } = require("../../controllers");

router.get("/", auth, userHistoryController.readAllInvoice);

module.exports = router;
