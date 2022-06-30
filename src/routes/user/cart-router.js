const express = require("express");
const router = express.Router();

const { userCartController } = require("../../controllers");

router.get("/:userId", userCartController.readCart);
// router.get("/sort/by-price/:order", userCartController.sortCarts);
// router.get("/search", userCartController.searchCarts);
// router.get("/best-seller", userCartController.readCartBestSeller);
// router.get("/:CartId", userCartController.readCartById);

module.exports = router;
