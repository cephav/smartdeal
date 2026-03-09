const Deal = require("../models/Deal");

exports.getDashboard = async (req, res) => {
  try {

    const topDeals = await Deal.find()
      .sort({ discountPercent: -1 })
      .limit(5);

    const latestDeals = await Deal.find()
      .sort({ createdAt: -1 })
      .limit(5);

    const platforms = await Deal.distinct("platform");
    const platformDeals = {};

    for (const platform of platforms) {
      platformDeals[platform] = await Deal.find({ platform })
        .sort({ discountPercent: -1 })
        .limit(5);
    }

    res.json({
      platformDeals,
      topDeals,
      latestDeals
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};