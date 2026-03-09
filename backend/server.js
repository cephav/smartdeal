require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cron = require("node-cron");
const { scrapeSales } = require("./scraper/salesScraper")
const connectDB = require("./config/db");
const Deal = require("./models/Deal");
const scraperRoutes = require("./routes/scraperRoutes");
const authRoutes = require("./routes/authRoutes");
const productRoutes = require("./routes/productRoutes");
const alertRoutes = require("./routes/alertRoutes");
const dealRoutes = require("./routes/dealRoutes");
const dashboardRoutes = require("./routes/dashboardRoutes");
const saleRoutes = require("./routes/saleRoutes");
const app = express();


app.use(cors({
  origin: "*"
}));
connectDB();

// Cleanup once on startup: remove deals without an image
(async () => {
  try {
    const result = await Deal.deleteMany({
      $or: [
        { imageUrl: { $exists: false } },
        { imageUrl: "" },
        { imageUrl: null }
      ]
    });
    if (result.deletedCount) {
      console.log(`Cleaned up ${result.deletedCount} deals without imageUrl`);
    }
  } catch (err) {
    console.error("Failed to clean up deals without imageUrl", err.message);
  }
})();
cron.schedule("0 */6 * * *", () => {
  console.log("Running sales scraper...");
  scrapeSales();
});
app.use(cors());
app.use(express.json());

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/alerts", alertRoutes);
app.use("/api/deals", dealRoutes);
app.use("/api/dashboard", dashboardRoutes);
app.use("/api/sales", saleRoutes);
app.use("/api/scrape", scraperRoutes);
app.get("/", (req, res) => {
  res.send("SmartDeal API Running");
}); 
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
