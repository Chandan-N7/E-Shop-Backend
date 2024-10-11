const Cart = require("../Model/cartModel");
const User = require("../Model/userModle");


const addToCart = async (req, res) => {
    const { productId } = req.body;
    const userId = req.userId
    if (!userId) {
        return res.status(401).json({ message: "You are not authenticated" })
    }
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            cart = new Cart({
                userId,
                item: [{ productId, quantity: 1 }]
            })
        } else {
            const productIndex = cart.item.findIndex(item => item.productId.toString() === productId)
            if (productIndex > -1) {
                cart.item[productIndex].quantity += 1;
            } else {
                cart.item.push({ productId, quantity: 1 });
            }
        }
        await cart.save();
        res.status(200).json({ message: 'Product added to cart successfully', cart })
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

//GEt Cart
const getCartProducts = async (req, res) => {
    try {
        const userData = await User.findById(req.userId)
        if (!userData) {
            return res.status(404).send("User with the given id is not found")
        }
        const cartProducts = await Cart.find({ userId: userData._id });
        if (!cartProducts || cartProducts.length === 0) {
            return res.status(404).json({ message: 'No cart items found for this user.' });
        }
        res.status(200).json(cartProducts);
    } catch (error) {
        res.status(500).json({ message: 'Server error' });
    }
}

//Increase Product Quantity In Cart
const increaseProductQuantity = async (req, res) =>{
    const {productId} = req.body;
    const userId = req.userId;
    if(!userId){
        return res.status(401).json({ message: "You are not authenticated" });
    }
    try {
        let cart = await Cart.findOne({userId});
        if(!cart){
        return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.item.findIndex(item=>item.productId.toString() === productId)
        if(productIndex > -1){
            cart.item[productIndex].quantity += 1;
            await cart.save();
            res.status(200).json({ message: "Product quantity increased", cart });
        }else {
            res.status(404).json({ message: "Product not found in cart" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// Decrease Product Quantity in Cart
const decreaseProductQuantity  = async (req, res) =>{
    const {productId} = req.body;
    const userId = req.userId;
    if(!userId){
        return res.status(401).json({ message: "You are not authenticated" });
    }
    try {
        let cart = await Cart.findOne({userId});
        if(!cart){
        return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.item.findIndex(item=>item.productId.toString() === productId)
        if(productIndex > -1){
            cart.item[productIndex].quantity -= 1;
            await cart.save();
            res.status(200).json({ message: "Product quantity increased", cart });
        }else {
            res.status(404).json({ message: "Product not found in cart" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// remove from Cart
const removeProductFromCArt = async (req, res)=>{
    const { productId } = req.body;
    const userId = req.userId;

    if (!userId) {
        return res.status(401).json({ message: "You are not authenticated" });
    }
    try {
        let cart = await Cart.findOne({ userId });

        if (!cart) {
            return res.status(404).json({ message: "Cart not found" });
        }

        const productIndex = cart.item.findIndex(item => item.productId.toString() === productId);

        if (productIndex > -1) {
            cart.item.splice(productIndex, 1); // Remove the product from the cart
            await cart.save();
            res.status(200).json({ message: "Product removed from cart", cart });
        } else {
            res.status(404).json({ message: "Product not found in cart" });
        }

    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}

// remove from cart 
const removeFromCart = async(req,res)=>{
    try {
    const userId = req.userId;
    let cart = await Cart.findOne({ userId });
    if (!cart) {
        return res.status(404).json({ message: "Cart not found" });
    }
    cart.item = [];
    await cart.save();
    res.status(200).json({success:true,cart});
        
    } catch (error) {
        console.log(error);
        res.status(500).json({ message: 'Server error' });
    }
}


module.exports = { addToCart, getCartProducts, increaseProductQuantity,decreaseProductQuantity, removeProductFromCArt, removeFromCart};
