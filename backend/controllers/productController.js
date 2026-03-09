const Product = require("C:/smartdeal/backend/models/Products.js");

exports.createProduct = async (req, res) => {
  try {
    const { title, price, platform, imageUrl, productUrl } = req.body;

    const existingProduct = await Product.findOne({
      title,
      platform,
      user: req.user.userId
    });

    if (existingProduct) {
      return res.status(400).json({
        message: "Product already saved"
      });
    }

    const product = new Product({
      title,
      price,
      platform,
      imageUrl,
      productUrl,
      user: req.user.userId
    });

    await product.save();

    res.status(201).json(product);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.getMyProducts = async (req, res) => {
  try {
    const products = await Product.find({
      user: req.user.userId
    });

    res.json(products);

  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
