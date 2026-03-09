const mongoose=require('mongoose')

const SaleSchema=new mongoose.Schema({
    platform:{
        type:String,
        required:true
    },
    saleName:{
        type:String,
        required:true
    },
    saleUrl:{          // 👈 ADD THIS
        type:String
    },
    status:{
        type:String,
        enum:["Live","Upcoming","Ended"],
        default:"Upcoming"
    },
    startDate:Date,
    endDate:Date
},{timestamps:true})

module.exports = mongoose.model("Sale", SaleSchema);