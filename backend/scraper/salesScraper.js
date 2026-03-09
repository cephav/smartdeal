const axios = require("axios");
const cheerio = require("cheerio");
const Sale = require("../models/Sale");

exports.scrapeSales = async () => {

  try {

    const platforms = [
      { name: "Amazon", url: "https://www.amazon.in" },
      { name: "Flipkart", url: "https://www.flipkart.com" },
      { name: "Myntra", url: "https://www.myntra.com" },
      { name: "Ajio", url: "https://www.ajio.com" }
    ];

    for (const platform of platforms) {

      const { data } = await axios.get(platform.url, {
        headers: {
          "User-Agent":
            "Mozilla/5.0 (Windows NT 10.0; Win64; x64)"
        }
      });

      const $ = cheerio.load(data);

      const detectedSales = [];

      $("img, a, h1, h2, h3, span").each((i, el) => {

        const text =
          $(el).attr("alt") ||
          $(el).text();

        if (!text) return;

        const t = text.toLowerCase();

        if (
          t.includes("sale") ||
          t.includes("festival") ||
          t.includes("offer") ||
          t.includes("days")
        ) {

          detectedSales.push({
            platform: platform.name,
            saleName: text.trim(),
            status: "Live"
          });

        }

      });

      // remove duplicates
      const uniqueSales = [...new Set(detectedSales.map(s => s.saleName))]
        .map(name => ({
          platform: platform.name,
          saleName: name,
          status: "Live"
        }));

      await Sale.deleteMany({ platform: platform.name });

      if (uniqueSales.length > 0) {
        await Sale.insertMany(uniqueSales.slice(0, 5));
      }

      console.log(`${platform.name} sales scraped`);

    }

  } catch (err) {

    console.log("Sales scraper error:", err.message);

  }

};