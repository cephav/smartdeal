const mongoose = require("mongoose");

const PriceAlertSchema = new mongoose.Schema(
{
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    product: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Deal",
        required: true
    },

    targetPrice: {
        type: Number,
        required: true
    }
},
{ timestamps: true }
);

module.exports = mongoose.model("PriceAlert", PriceAlertSchema);