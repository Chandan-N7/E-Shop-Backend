const Products = require("../Model/productModel.js");

const createProduct = async (req, res) => {
    try {
        // Check if files are uploaded
        if (!req.files || req.files.length === 0) {
            console.log(req.file)
            return res.status(400).json({ message: 'No files were uploaded' });
        }

        // Extract product details from the request body
        const { productName, productBrand, productCategory, productPrice, productDisPrice, productDescription } = req.body;

        // Map through the files to get their paths
        const image_filename = req.files.map(file => file.path);

        // Create a new product entry in the database
        const product = await Products.create({
            productName,
            productBrand,
            productCategory,
            productImages: image_filename,
            productPrice,
            productDisPrice,
            productDescription,
        });

        // Send a success response
        res.status(201).json(product);
    } catch (error) {
        // Handle errors
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
};


//GEt products
const getProducts = async (req, res) => {
    try {
        const product = await Products.find();
        res.status(200).json(product);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

// delete product
const deleteProduct = async (req, res) => {
    try {
        const { id } = req.params;
        const product = await Products.findById(id);
        if (!product) {
            return res.status(404).json({ message: 'Product not found' })
        }
        await Products.findByIdAndDelete(id);
        res.status(200).json({ message: 'Product and associated images deleted successfully', product });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Server error' });
    }
}
module.exports = { createProduct, getProducts, deleteProduct };
