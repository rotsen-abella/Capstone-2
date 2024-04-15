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

//Route for retrieving single product
router.get("/:productId", productController.getProduct);

//Route for updating product information
router.patch("/:productId/update", verify, verifyAdmin, productController.updateProduct);

//Router for archiving a product
router.patch("/:productId/archive", verify, verifyAdmin, productController.archiveProduct);

//Router for activating a product
router.patch("/:productId/activate", verify, verifyAdmin, productController.activateProduct);

// Search products by name
router.post('/searchByName', productController.searchProductsByName);

// Search products by price range
router.post('/searchByPrice', productController.searchProductsByPriceRange);


module.exports = router;