const express = require("express");
const productController = require("../controllers/product");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();


//Create Product (Admin Only)
router.post("/",verify, verifyAdmin, productController.createProduct);

//Retrieve all products
router.get("/all", verify, verifyAdmin, productController.getAllProducts);

//Retrieve all active products
router.get("/", productController.getAllActiveProduct);


module.exports = router;