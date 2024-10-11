const instance = require("../Middleware/paymentMiddleware.js");
const crypto = require('crypto');
const Order = require("../Model/paymentModel.js");
const User = require("../Model/userModle.js");

const checkOut = async (req, res) => {
    try {
        const option = {
            amount: Number(req.body.amount * 100),
            currency: "INR",
        };
        const order = await instance.orders.create(option)
        res.status(200).json(order)
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error)
    }
}

const paymentVerification = async (req, res) => {
    try {
        const { razorpay_payment_id, razorpay_order_id, razorpay_signature } = req.body; // Extract Razorpay data
        const cartData = req.query.cartData ? JSON.parse(decodeURIComponent(req.query.cartData)) : null; // Get and parse cart data from query
        const userId = req.query.userId;
        const amount = req.query.amount;
        const orderItems = cartData.map(item => ({
            product: item.productId,  // Product ID from the cart data
            quantity: item.quantity    // Quantity from the cart data
        }));

        const body = razorpay_order_id + "|" + razorpay_payment_id;
        const generated_signature = crypto.createHmac('sha256', process.env.RAZOPAY_API_SECRET)
            .update(body.toString())
            .digest('hex');
        const isAuthentic = generated_signature === razorpay_signature;
        if (isAuthentic) {
            const newPayment = new Order({
                userId: userId,
                amount:amount,
                razorpay_payment_id: razorpay_payment_id,
                razorpay_order_id: razorpay_order_id,
                razorpay_signature: razorpay_signature,
                orderItems: orderItems,  // Add the cart data here
            });
            await newPayment.save();
            res.redirect(`${process.env.CLIENTSIDE_URL}/paymentsuccess?reference=${razorpay_payment_id}`)
        } else {
            res.status(400).json({ success: false });
        }

    } catch (error) {
        res.status(500).json({ message: 'Server error' });
        console.log(error)
    }
}

// get order list 
const getOrderList = async (req, res) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).send("User with the given id is not found")
        }
        const orderList = await Order.find({ userId: userData._id });
        if (!orderList || orderList.length === 0) {
            return res.status(404).json({ message: 'No cart items found for this user.' });
        }
        res.status(200).json(orderList);
    } catch (error) {
        console.log(error)
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = { checkOut, paymentVerification, getOrderList };
