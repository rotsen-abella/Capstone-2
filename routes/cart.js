const express = require("express");
const cartController = require("../controllers/cart");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

//add to cart
router.post('/add-to-cart', verify, verifyAdmin, cartController.addToCart);

//update cart
router.patch('/update-cart-quantity', verify, verifyAdmin, cartController.updateCart)

module.exports = router;