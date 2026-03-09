const PriceAlert=require('../models/PriceAlert');
exports.createAlert= async(req,res)=>{
    try{
        const {productId,targetPrice}=req.body;
        const alert=new PriceAlert({
            user:req.user.userId,
            product:productId,
            targetPrice
        });
        await alert.save();
        res.status(201).json(alert)
    }
    catch(err){
        res.status(500).json({error:err.message})
    }
}
exports.checkAlerts = async (req,res)=>{
 try{

  const alerts = await PriceAlert.find({
   user:req.user.userId
  }).populate("product");

  const triggered=[];

  alerts.forEach(alert=>{
 console.log("PRICE:",alert.product.discountPrice)
 console.log("TARGET:",alert.targetPrice)
   if(alert.product && alert.product.discountPrice <= alert.targetPrice){

    triggered.push({
     product:alert.product.title,
     price:alert.product.discountPrice,
     target:alert.targetPrice,
     platform:alert.product.platform
    });

   }

  });

  res.json({triggered});

 }catch(err){
  res.status(500).json({error:err.message});
 }
}
exports.getMyAlerts = async (req, res) => {
  try {
    const alerts = await PriceAlert.find({
      user: req.user.userId
    }).populate("product", "title discountPrice platform");

    res.json(alerts);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};