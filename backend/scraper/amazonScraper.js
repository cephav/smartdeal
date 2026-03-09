const axios = require("axios");
const cheerio = require("cheerio");
const Deal = require("../models/Deal");

exports.scrapeAmazon = async (req, res) => {
  try {

    // search query from API
    const query = req.query.q || "iphone";

    const url = `https://www.amazon.in/s?k=${query}`;

    const { data } = await axios.get(url, {
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 Chrome/120.0 Safari/537.36"
      }
    });

    const $ = cheerio.load(data);

    const deals = [];

   $(".s-result-item[data-component-type='s-search-result']").each((i, el) => {

  if (deals.length === 15) return false;

  const title = $(el).find("h2 span").text().trim();

  const priceText = $(el)
    .find(".a-price .a-offscreen")
    .first()
    .text()
    .replace("₹", "")
    .replace(/,/g, "")
    .trim();

  const price = Number(priceText);

  const image = $(el).find("img.s-image").attr("src");

  const linkTag = $(el).find("h2 a").attr("href");
  const link = linkTag ? "https://www.amazon.in" + linkTag : "";

  if (title && price && !isNaN(price)) {
    deals.push({
      title,
      platform: "Amazon",
      originalPrice: price,
      discountPrice: price,
      discountPercent: 0,
      imageUrl: image || "",
      productUrl: link
    });
  }

});
    // clear old amazon deals
   // await Deal.deleteMany({ platform: "Amazon" });

    await Deal.insertMany(deals);

    res.json({
      message: "Amazon deals scraped successfully",
      query,
      totalScraped: deals.length
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};