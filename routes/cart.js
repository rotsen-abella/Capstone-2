const express = require("express");
const cartController = require("../controllers/cart");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();


//Route for getting user's cart
router.get("/get-cart", verify, cartController.getCart);

//add to cart
router.post('/add-to-cart', verify, cartController.addToCart);

//update cart
router.post('/update-cart-quantity', verify, cartController.updateCart)

//Remove item from cart
router.patch("/:productId/remove-from-cart", verify, cartController.removeFromCart);

//Clear cart
router.put("/clear-cart", verify, cartController.clearCart);

module.exports = router;