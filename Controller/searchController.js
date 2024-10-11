const Products = require("../Model/productModel.js");

const searchProducts = async (req, res) => {
    const { query } = req.body;
    if (!query) {
        return res.status(400).json({ message: "No search query provided" });
    }
    try {
        const product = await Products.find({
            $or: [
                { productName: { $regex: query, $options: "i" } },
                { productCategory: { $regex: query, $options: "i" } },
                { productDescription: { $regex: query, $options: "i" } },
            ]
        });
        if(product.length === 0){
            return res.status(404).json({ message: "No products found" });
        }
        res.status(200).json(product);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Server error" });
    }
} 
module.exports = searchProducts;