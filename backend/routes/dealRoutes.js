const express = require("express");
const router = express.Router();
const authMiddleware=require('../middleware/authMiddleware')
const {
  createDeal,
  getDeals,
  getTopDeals,
  getBestDeals,
  compareDeals,
  getRecommendations,
  searchDeals
} = require("../controllers/dealController");router.get("/", getDeals);
router.get("/top", getTopDeals);
router.get("/best", getBestDeals);
router.get("/recommendations", authMiddleware, getRecommendations);
router.get("/search", searchDeals);
router.get("/compare/:title", compareDeals);
router.post("/",authMiddleware, createDeal);
module.exports = router;