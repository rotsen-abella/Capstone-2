const express = require('express');
const router = express.Router();
const orderController = require('../controllers/order');
const { verify, verifyAdmin } = require("../auth");

// Retrieve all orders (admin only)
router.get('/all', verify, verifyAdmin, orderController.getAllOrders);

// Retrieve authenticated user's orders
router.get('/user', verify, verifyAdmin, orderController.getUserOrders);

module.exports = router;