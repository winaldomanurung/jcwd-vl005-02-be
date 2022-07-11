const express = require("express");
const router = express.Router();
const auth = require("../../helpers/authorization-token");

const { userCheckoutController } = require("../../controllers");

router.get("/", auth, userCheckoutController.readAllCart);
router.post("/add-address", auth, userCheckoutController.addAddress);
router.get("/addresses", auth, userCheckoutController.readAllAddresses);
router.get(
  "/addresses/:addressId",
  auth,
  userCheckoutController.readAddressById
);
router.post("/invoice", auth, userCheckoutController.addInvoice);
// router.get("/get-invoice", auth, userCheckoutController.readInvoice);
router.get(
  "/get-invoice/:invoiceCode",
  auth,
  userCheckoutController.readInvoice
);

router.post(
  "/upload/:invoiceId",
  auth,
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
