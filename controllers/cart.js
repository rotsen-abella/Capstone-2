const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require('../auth');

module.exports.getCart = (req, res) => {
    return Cart.find({userId : req.user.id})
        .then(cart => {
            if (cart.length > 0){
                return res.status(200).send({cart});
            }
            return res.status(404).send({error: "Cart not found"});
        })
        .catch(err => {
            console.error("Error in fetching cart")
        return res.status(500).send({ error: 'Failed to fetch cart' })
        })
};


module.exports.addToCart = async (req, res) => {

    try {
        // Find the cart with the user's id from the token
        let cart = await Cart.findOne({ userId: req.user.id });

        // If no cart document with the current user's id can be found, create a new cart
        if (!cart) {
            cart = new Cart({
                userId: req.user.id,
                cartItems: [],
                totalPrice: 0
            });
        }

        // Check if the cart's cartItems array already contains the id of the product to be added
        const { productId, quantity, subtotal } = req.body;
        const existingItemIndex = cart.cartItems.findIndex(item => item.productId === productId);

        if (existingItemIndex !== -1) {
            // If the product already exists in the cart, update the quantity and subtotal
            cart.cartItems[existingItemIndex].quantity += quantity;
            cart.cartItems[existingItemIndex].subtotal += subtotal;
        } else {
            // If the product doesn't exist in the cart, add it
            cart.cartItems.push({ productId, quantity, subtotal });
        }

        // Update the totalPrice value of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the cart document
        await cart.save();

        // Send the updated cart to the client
        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (err) {
        // Catch an error while updating the cart and send a message to the client along with the error details
        console.error('Error adding item to cart:', err);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
    
};

module.exports.updateCart = async (req, res) => {
    try {
        
        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }
        
        // Extract product ID and new quantity from request body
        const { productId, quantity, subtotal } = req.body;

        // Find the item in the cart
        const item = cart.cartItems.find(item => item.productId === productId);

        if (item) {
            // If the item is found, update its quantity and subtotal
            item.quantity = quantity;
            item.subtotal = subtotal;

        }  
        else {
            // If the product doesn't exist in the cart, add it
            cart.cartItems.push({ productId, quantity, subtotal });
        }
        // Update total price for all items in the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

            // Save the updated cart
            await cart.save();

            res.status(200).json({ message: 'Cart quantity updated successfully', cart });
         
        
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ error: 'Failed to update cart quantity' });
    }
};
