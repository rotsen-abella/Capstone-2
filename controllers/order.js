const Order = require('../models/Order');
const { verify, verifyAdmin } = require("../auth");
const bcrypt = require("bcrypt");

// Retrieve all orders (admin only)
module.exports.getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find();
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error retrieving all orders:', error);
        res.status(500).json({ error: 'Failed to retrieve all orders' });
    }
};

// Retrieve authenticated user's orders
module.exports.getUserOrders = async (req, res) => {
    try {
        const userId = req.user._id;
        const orders = await Order.find({ user: userId });
        res.status(200).json({ orders });
    } catch (error) {
        console.error('Error retrieving user orders:', error);
        res.status(500).json({ error: 'Failed to retrieve user orders' });
    }
};