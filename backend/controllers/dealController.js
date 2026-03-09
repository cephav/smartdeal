const Deal=require('../models/Deal');
exports.getDeals = async (req, res) => {
  try {

    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;

    const skip = (page - 1) * limit;

    const deals = await Deal
      .find()
      .skip(skip)
      .limit(limit)
      .sort({ createdAt: -1 });

    const totalDeals = await Deal.countDocuments();

    res.json({
      page,
      totalPages: Math.ceil(totalDeals / limit),
      totalDeals,
      deals
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.createDeal = async (req, res) => {
  try {
    if (!req.body.imageUrl) {
      return res.status(400).json({ message: "Image URL is required" });
    }

    const existingDeal = await Deal.findOne({
      title: req.body.title,
      platform: req.body.platform
    });

    if (existingDeal) {
      return res.status(400).json({
        message: "Deal already exists"
      });
    }

    const deal = new Deal(req.body);
    await deal.save();

    res.status(201).json(deal);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.searchDeals = async (req, res) => {
  try {
    const query = req.query.q;
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 12;
    const skip = (page - 1) * limit;

    const deals = await Deal.find({
      title: { $regex: query, $options: "i" }
    })
    .skip(skip)
    .limit(limit)
    .sort({ createdAt: -1 });

    const totalDeals = await Deal.countDocuments({
      title: { $regex: query, $options: "i" }
    });

    res.json({
      page,
      totalPages: Math.ceil(totalDeals / limit),
      totalDeals,
      deals
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getTopDeals = async (req, res) => {
  try {
    const deals = await Deal.find()
      .sort({ discountPercent: -1 }) // highest discount first
      .limit(10); // only top 10 deals

    res.json(deals);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.compareDeals = async (req, res) => {
  try {
    const title = req.params.title;

    const keyword = title.split(" ")[0]; // first word

    const deals = await Deal.find({
      title: { $regex: keyword, $options: "i" }
    });

    if (deals.length === 0) {
      return res.json({ message: "No deals found" });
    }

    let bestDeal = deals[0];

    deals.forEach(deal => {
      if (deal.discountPrice < bestDeal.discountPrice) {
        bestDeal = deal;
      }
    });

    res.json({
      product: title,
      bestPrice: bestDeal,
      allDeals: deals
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getBestDeals=async(req,res)=>{
  try{
    const deals=await Deal.aggregate([
      {$sort:{discountPrice:1}},
      {
        $group:{
          _id:"$title",
          bestDeal:{$first:"$$ROOT"}
        }
      },
      {
        $replaceRoot:{newRoot:"$bestDeal"}
      }
    ])
    res.json(deals);
    
  }catch (err) {
    res.status(500).json({ error: err.message });
  }
};
exports.getRecommendations = async (req, res) => {
  try {

    const Product = require("../models/Products");

    const userProducts = await Product.find({
      user: req.user.userId
    });

    if (userProducts.length === 0) {
      return res.json({
        message: "No recommendations yet"
      });
    }

    const keywords = userProducts.map(p => p.title);

    const deals = await Product.find({
      title: { $regex: keywords.join("|"), $options: "i" }
    }).limit(10);

    res.json({
      recommendedDeals: deals
    });

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};