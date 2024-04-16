const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { verify, verifyAdmin } = require("../auth");

//Create Order
router.post('/checkout', verify, orderController.checkout);

// Retrieve all orders (admin only)
router.get('/all-orders', verify, verifyAdmin, orderController.getAllOrders);

// Retrieve authenticated user's orders
router.get('/my-orders', verify, orderController.getUserOrders);

module.exports = router;