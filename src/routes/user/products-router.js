const express = require("express");
const router = express.Router();

const { userProductController } = require("../../controllers");

router.get("/", userProductController.readProducts);
router.get("/sort/by-price/:order", userProductController.sortProducts);
router.get("/search", userProductController.searchProducts);
router.get("/best-seller", userProductController.readProductBestSeller);
router.get("/:productId", userProductController.readProductById);

module.exports = router;
