const express = require('express');
const { createProduct, getProducts, deleteProduct } = require('../Controller/productController.js');
const upload = require('../Middleware/multer.js');
const { registerUser, verifyOTP, resendOTP, login, getUSerInfo, logout } = require('../Controller/userController.js');
const verifyToken = require('../Middleware/authMiddleware.js');
const { addToCart, getCartProducts, increaseProductQuantity, decreaseProductQuantity, removeProductFromCArt, removeFromCart } = require('../Controller/cartController.js');
const filterProductController = require('../Controller/filterProductControler.js');
const searchProducts = require('../Controller/searchController.js');
const { checkOut, paymentVerification, getOrderList } = require('../Controller/paymentController.js');
const router = express.Router();

//Product Router
router.post('/upload-product', upload.array('productImages', 5), createProduct);
router.get('/get-products', getProducts);
router.delete('/delete-product/:id', deleteProduct);

//Auht Router
router.post('/create-user', registerUser)
router.post('/verifyOTP', verifyOTP)
router.post('/resendOTP', resendOTP)
router.post('/login', login)
router.get('/user-info', verifyToken, getUSerInfo)
router.post("/logout", logout);


//Cart Route 
router.post('/add-to-cart', verifyToken, addToCart);
router.get('/get-cart-products', verifyToken, getCartProducts);
router.post('/increse-products-quantity', verifyToken, increaseProductQuantity);
router.post('/decrease-products-quantity', verifyToken, decreaseProductQuantity);
router.post('/remove-from-cart', verifyToken, removeProductFromCArt);
router.get('/remove-cart', verifyToken, removeFromCart);

//Filter Product
router.post('/filter-product', filterProductController);

// Search products
router.post('/search-product', searchProducts);

// payment
router.post('/checkout', checkOut);
router.post('/payment-success', paymentVerification);
router.get('/get-order-list', verifyToken, getOrderList);





module.exports= router;
