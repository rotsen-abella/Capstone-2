const Order = require('../models/Order');
const Cart = require('../models/Cart');
const { verify, verifyAdmin } = require("../auth");
const bcrypt = require("bcrypt");

module.exports.checkout = async (req, res) => {
    try {
        // Extract user ID from the JWT
        const userId = req.user.id;

        // Find the cart with the user's id from the token
        const cart = await Cart.findOne({ userId });

        // If no cart document with the current user's id can be found, send a message to the client
        if (!cart) {
            return res.status(404).send({ message: "Cart not found" });
        }

        // Check if the cart has at least one item
        if (cart.cartItems.length === 0) {
            return res.status(400).send({ message: "Cart is empty. Unable to checkout" });
        }

        // Create a new order document using the cart data
        const order = new Order({
            userId : userId,
            productsOrdered: cart.cartItems,
            totalPrice: cart.totalPrice
        });

        // Save the order document
        await order.save();

        // Clear the cart
        cart.cartItems = [];
        cart.totalPrice = 0;
        await cart.save();

        // Send a success message to the client along with the created order details
        res.status(201).send({ message: "Order created successfully", order });
    } catch (err) {
        // Catch an error while creating the order and send a message to the client along with the error details
        console.error({message: "Error in creating order", err});
        res.status(500).send({ message: "Error in creating order" });
    }
};

// Retrieve all orders (admin only)
module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).send({ orders });
    } catch (error) {
        console.error('Error retrieving all orders:', error);
        res.status(500).send({ error: 'Failed to retrieve all orders' });
    }
};

// Retrieve authenticated user's orders
module.exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user.id;
        const orders = await Order.find({ userId: userId });

        if (!orders || orders.length === 0) {
            return res.status(404).send({ message: "No orders found for this user" });
        }

        res.status(200).send({ orders });
    } catch (error) {
        console.error('Error retrieving user orders:', error);
        res.status(500).send({ error: 'Failed to retrieve user orders' });
    }
};