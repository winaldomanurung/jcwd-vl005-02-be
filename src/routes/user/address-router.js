const express = require("express");
const router = express.Router();
const auth = require("../../helpers/authorization-token");

const { userAddressController } = require("../../controllers");

router.get("/", auth, userAddressController.readAllAddress);
router.delete("/:addressId", auth, userAddressController.deleteAddressById);
router.patch(
  "/update-address/:addressId",
  auth,
  userAddressController.updateAddressById
);

module.exports = router;
