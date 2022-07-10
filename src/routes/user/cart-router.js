const express = require("express");
const router = express.Router();

const auth = require("../../helpers/authorization-token");

const { userCartController } = require("../../controllers");

router.get("/:userId", userCartController.readCart);
router.get("/", auth, userCartController.readCart);
router.get("/:userId/all", userCartController.readAllCart);
router.post("/:userId/add/:productId", userCartController.addToCart);
router.post(
  "/:userId/add/:productId/:qty",
  userCartController.addToCartWithQuantity
);
router.patch(
  "/:userId/update/:productId",
  userCartController.updateCartQuantity
);
router.delete("/:userId/delete/:productId", userCartController.deleteCartItem);
// router.get("/:CartId", userCartController.readCartById);

module.exports = router;
