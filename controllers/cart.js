const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require('../auth');

module.exports.getCart = (req, res) => {
    return Cart.find({userId : req.user.id})
        .then(orders => {
            if (orders.length > 0){
                return res.status(200).send({orders});
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
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        const subtotal = product.price * quantity;
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
        res.status(200).send({ message: 'Item added to cart successfully', cart });
    } catch (err) {
        // Catch an error while updating the cart and send a message to the client along with the error details
        console.error('Error adding item to cart:', err);
        res.status(500).send({ error: 'Failed to add item to cart' });
    }
    
};

module.exports.updateCart = async (req, res) => {
    try {
        
        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.user.id });
        if (!cart) {
            return res.status(404).send({ error: 'Cart not found' });
        }
        
        // Extract product ID and new quantity from request body
        const { productId, quantity } = req.body;

        const product = await Product.findById(productId);
        const subtotal = product.price * quantity;
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

            res.status(200).send({ message: 'Cart quantity updated successfully', cart });
         
        
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).send({ error: 'Failed to update cart quantity' });
    }
};


module.exports.removeFromCart = async (req, res) => {
    try {
        // Find the cart with the user's id from the token
        const cart = await Cart.findOne({ userId: req.user.id });

        // If no cart document with the current user's id can be found, send a message to the client
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        // Extract productId from request params
        const { productId } = req.params;

        // Check if the cart's cartItems array contains the id of the product to be removed
        const indexToRemove = cart.cartItems.findIndex(item => item.productId === productId);

        if (indexToRemove !== -1) {
            // If the product exists in the cart, remove it
            cart.cartItems.splice(indexToRemove, 1);
        } else {
            // If the product doesn't exist in the cart, send a message to the client
            return res.status(404).send({ message: "Product not found in the cart" });
        }

        // Update the totalPrice value of the cart
        cart.totalPrice = cart.cartItems.reduce((total, item) => total + item.subtotal, 0);

        // Save the cart document
        await cart.save();

        // Send a success message to the client along with the updated cart contents
        res.status(200).send({ message: "Item removed from cart successfully", cart });
    } catch (err) {
        // Catch an error while updating the cart and send a message to the client along with the error details
        console.error(err);
        res.status(500).send({ message: "Error in removing item from cart", err });
    }
}

module.exports.clearCart = async (req, res) => {
    try {
        // Find the cart with the user's id from the token
        const cart = await Cart.findOne({ userId: req.user.id });

        // If no cart document with the current user's id can be found, send a message to the client
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        // Check if the cart has at least 1 item
        if (cart.cartItems.length > 0) {
            // If the cart has items, clear all items from the cartItem array and update totalPrice to 0
            cart.cartItems = [];
            cart.totalPrice = 0;
        } else {
            // If the cart is already empty, send a message to the client
            return res.status(400).send({ message: "Cart is already empty" });
        }

        // Save the cart document
        await cart.save();

        // Send a success message to the client along with the updated cart contents
        res.status(200).send({ message: "Cart cleared successfully", cart });
    } catch (err) {
        // Catch an error while updating the cart and send a message to the client along with the error details
        console.error(err);
        res.status(500).send({ message: "Error in clearing cart", err });
    }
}