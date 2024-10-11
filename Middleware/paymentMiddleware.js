const dotenv = require('dotenv')
dotenv.config();

const Razorpay = require('razorpay');

const instance = new Razorpay({
  key_id: process.env.RAZOPAY_API_KEY,
  key_secret: process.env.RAZOPAY_API_SECRET,
});

module.exports = instance;
