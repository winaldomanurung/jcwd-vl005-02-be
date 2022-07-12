const express = require("express");
const { braintreeController } = require("../../controllers");
const router = express.Router();
const auth = require("../../helpers/authorization-token");

router.get("/getToken", auth, braintreeController.generateToken);
router.post("/getToken/pay", auth, braintreeController.processPayment);

module.exports = router;
