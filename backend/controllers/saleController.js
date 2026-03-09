const Sale=require('../models/Sale')

exports.getSales = async (req,res)=>{
  try{

    const sales = await Sale.find().sort({ startDate:-1 })

    const today = new Date()

    const updatedSales = sales.map(sale => {

      let status = "Upcoming"

      if (today >= sale.startDate && today <= sale.endDate) {
        status = "Live"
      } 
      else if (today > sale.endDate) {
        status = "Ended"
      }

      return {
        ...sale._doc,
        status
      }

    })

    res.json(updatedSales)

  }catch(err){

    res.status(500).json({error:err.message})

  }
}
exports.createSale=async(req,res)=>{
    try{
        const sale=new Sale(req.body)
        await sale.save()
        res.status(201).json(sales)
    }catch (err) {
    res.status(500).json({ error: err.message });
}
}