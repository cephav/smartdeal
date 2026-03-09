const mongoose=require('mongoose')
const DealSchema=new mongoose.Schema({
    title:{
        type:String,
        required:true
    },
    platform:{
        type:String,
        required:true
    },
    originalPrice:{
        type:Number
    },
    discountPrice:{
        type:Number,
        required:true
    },
    discountPercent:{
        type:Number
    },
    imageUrl:{
        type:String,
        required:true,
        trim:true
    },
    productUrl: {
    type: String
  }

}, { timestamps: true });

module.exports = mongoose.model("Deal", DealSchema);
