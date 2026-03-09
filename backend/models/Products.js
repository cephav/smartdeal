const mongoose=require('mongoose');
const ProductSchema=mongoose.Schema(
    {
        title:{
            type:String,
            required:true
        },
        price:{

            type:Number,
            required:true
        },
        platform:{
            type:String,
            required:true
        },
        imageUrl:{
            type:String
        },
        productUrl:{
            type:String
        },
        user:{
            type:mongoose.Schema.Types.ObjectId,
            ref:"User",
            required:true
        }
    },
    {
        timestamps:true
    }
);
module.exports=mongoose.model("Product",ProductSchema);