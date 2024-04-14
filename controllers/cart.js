const Cart = require("../models/Cart");
const Product = require("../models/Product");
const auth = require('../auth');

module.exports.addToCart = async (req, res) => {
    try {
        // Extract product ID and quantity from request body
        const { productId, quantity } = req.body;

        // Find the product by its ID
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }

        // Calculate subtotal for the item
        const subtotal = product.price * quantity;

        // Find the user's cart or create a new one if it doesn't exist
        let cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            cart = new Cart({ userId: req.user._id, items: [] });
        }

        // Check if the product already exists in the cart
        const existingItem = cart.items.find(item => item.productId.equals(productId));

        if (existingItem) {
            // If the product already exists in the cart, update its quantity and subtotal
            existingItem.quantity += quantity;
            existingItem.subtotal += subtotal;
        } else {
            // Otherwise, add a new item to the cart
            cart.items.push({ productId, quantity, subtotal });
        }

        // Calculate total price for all items in the cart
        cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);

        // Save the updated cart
        await cart.save();

        res.status(200).json({ message: 'Item added to cart successfully', cart });
    } catch (error) {
        console.error('Error adding item to cart:', error);
        res.status(500).json({ error: 'Failed to add item to cart' });
    }
};

module.exports.updateCart = async (req, res) => {
    try {
        // Extract product ID and new quantity from request body
        const { productId, quantity } = req.body;

        // Find the user's cart
        const cart = await Cart.findOne({ userId: req.user._id });
        if (!cart) {
            return res.status(404).json({ error: 'Cart not found' });
        }

        // Find the item in the cart
        const item = cart.items.find(item => item.productId.equals(productId));

        if (item) {
            // If the item is found, update its quantity and subtotal
            item.quantity = quantity;
            item.subtotal = item.quantity * item.price;

            // Update total price for all items in the cart
            cart.totalPrice = cart.items.reduce((total, item) => total + item.subtotal, 0);

            // Save the updated cart
            await cart.save();

            res.status(200).json({ message: 'Cart quantity updated successfully', cart });
        } else {
            res.status(404).json({ error: 'Item not found in cart' });
        }
    } catch (error) {
        console.error('Error updating cart quantity:', error);
        res.status(500).json({ error: 'Failed to update cart quantity' });
    }
};
