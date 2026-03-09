const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const { createProduct, getMyProducts } = require("../controllers/productController");

router.post("/", authMiddleware, createProduct);
router.get("/my-products", authMiddleware, getMyProducts);

module.exports = router;
