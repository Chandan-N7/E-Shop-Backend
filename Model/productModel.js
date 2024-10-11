const mongoose  = require('mongoose');

const productSchema = new mongoose.Schema({
    productName:{
        type:String,
        required:true
    },
    productBrand:{
        type:String,
        required:true
    },
    productCategory:{
        type:String,
        required:true
    },
    productImages:{
        type: [String],
        required:true
    },
    productPrice:{
        type:Number,
        required:true
    },
    productDisPrice:{
        type:Number,
        required:true
    },
    productDescription:{
        type:String,
        required:true
    },

})

const Products = mongoose.model('Products',productSchema);
module.exports = Products;