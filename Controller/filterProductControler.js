const Products = require("../Model/productModel")

const filterProductController = async(req, res)=>{
    try {
        const categoryList = req?.body?.category || [];

        const product = await Products.find({
            productCategory:{
                "$in":categoryList
            }
        })
        res.status(200).json({
            data: product,
            message:"Product",
            categoryList:categoryList
        })
    } catch (error) {
        res.status(500).json({message:error.message || error})
        
    }
}

module.exports = filterProductController;