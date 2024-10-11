const mongoose = require('mongoose');
const Products = require('./productModel');
const paymentSchema = new mongoose.Schema({
    userId:{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    razorpay_payment_id:{
        type: String,
        required:true
    },
    razorpay_order_id:{
        type: String,
        required:true
    },
    razorpay_signature:{
        type: String,
        required:true
    },
    amount:{
        type:Number,
        required:true
    },
    orderItems:[{
        product: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            required: true
        },
    }],
    date: { 
        type: Date,
        default: Date.now
    },
}) 
const Order = mongoose.model('Order',paymentSchema);
module.exports = Order;