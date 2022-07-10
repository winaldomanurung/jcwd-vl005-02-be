const express = require("express");
const router = express.Router();
const auth = require("../../helpers/authorization-token");

const { userCheckoutController } = require("../../controllers");

router.get("/:userId", userCheckoutController.readAllCart);
router.post("/:userId/add-address", userCheckoutController.addAddress);
router.get("/:userId/addresses", userCheckoutController.readAllAddresses);
router.get(
  "/:userId/addresses/:addressId",
  userCheckoutController.readAddressById
);
router.post("/:userId/invoice", userCheckoutController.addInvoice);
router.get("/:userId/get-invoice", userCheckoutController.readInvoice);
router.post(
  "/:userId/upload/:invoiceId",
  userCheckoutController.createPaymentProof
);

// router.post(
//   "/:userId/add/:productId/:qty",
//   userCheckoutController.addToCartWithQuantity
// );
// router.patch(
//   "/:userId/update/:productId",
//   userCheckoutController.updateCartQuantity
// );
// router.delete(
//   "/:userId/delete/:productId",
//   userCheckoutController.deleteCartItem
// );

module.exports = router;
