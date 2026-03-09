const express = require("express");
const router = express.Router();

const { scrapeAmazon } = require("../scraper/amazonScraper");

router.get("/amazon", scrapeAmazon);

module.exports = router;