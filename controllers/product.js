const Product = require("../models/Product");
const auth = require('../auth');
const bcrypt = require("bcrypt");

module.exports.createProduct = (req, res) => {

    let newProduct = new Product({
        name : req.body.name,
        description : req.body.description,
        price : req.body.price
    });

    Product.findOne({name: req.body.name})
    .then(existingProduct => {
        if (existingProduct){
            return res.status(409).send({error: "Product already exists"})
        }
        return newProduct.save()
        .then(savedProduct => {
            return res.status(201).send({savedProduct})
        })
        .catch(saveErr => {
            console.error("Error in saving the product:", saveErr);
            return res.status(500).send({error: 'Failed to save the product'})
        });
    })
    .catch(findErr=>{
        console.error("Error in finding the product", findErr)
        return res.status(500).send({error: 'Error finding the product'})
    })};

module.exports.getAllProducts = (req, res) => {

    return Product.find({})
    .then(products => {
        if(products.length > 0){
            return res.status(200).send({products});
        } else {
            return res.status(200).send({ message: 'No products found.' });
        }
    })
    .catch(err => {
        console.error("Error in finding all products: ", err)
        return res.status(500).send({error: "Error finding products"})
    });
};

module.exports.getAllActiveProduct = (req, res) => {

    Product.find({ isActive: true })
    .then(products => {
        
        if (products.length > 0){
            return res.status(200).send({products})
        }else{
            return res.status(200).send({message: "No active products found."})
        }
    }).catch(err => {
        console.error("Error in finding active products: ", err)
        return res.status(500).send({error: 'Error in finding active products.'})
    });

};

module.exports.getProduct = (req, res) => {

    const productId = req.params.productId;
    Product.findById(productId)
    .then(product => {
        if(!product){
            return res.status(404).send({error: 'Product notr found'});
        }
        return res.status(200).send({product});
    })
    .catch(err => {
        console.error("Error in fetching the product: ", err)
        return res.status(500).send({ error: 'Failed to fetch product' });
    });
};

module.exports.updateProduct = (req, res) => {

    let updatedProduct = {
        name: req.body.name,
        description: req.body.description,
        price: req.body.price
    }

    return Product.findByIdAndUpdate(req.params.productId, updatedProduct, {new: true})
    .then(updatedProduct => {

        if(updatedProduct) {
            res.status(200).send({
                message: 'Product updated successfully',
                updatedProduct: updatedProduct   
            });
        } else {
            res.status(404).send({error: 'Product not found'})
        }
    })
    .catch(err => {
        console.error("Error in updating product :", err)
        return res.status(500).send({error: 'Error in updating product'})
    });

}

module.exports.archiveProduct = (req, res) => {

    let updateActiveField = {
        isActive: false
    }

    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(archiveProduct => {
            if (archiveProduct) {
                res.status(200).send({
                    message: 'Product archived successfully', 
                    archiveProduct: archiveProduct     
                });
            } else {
                res.status(400).send({ error: 'Product not found' });
            }
        })
        .catch(err => {
            console.error("Error in archiving a product: ", err)
            return res.status(500).send({ error: 'Failed to archive product' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

module.exports.activateProduct = (req, res) => {

    let updateActiveField = {
        isActive: true
    }
    
    if (req.user.isAdmin == true){
        return Product.findByIdAndUpdate(req.params.productId, updateActiveField)
        .then(activateProduct => {
            if (activateProduct) {
                res.status(200).send({
                    message: 'Product activated successfully', 
                    activateProduct: activateProduct
                });
            } else {
                res.status(400).send({error: "Product not found"});
            }
        })
        .catch(err => {
            console.error("Error in activating a product: ", err)
            return res.status(500).send({ error: 'Failed to activating a product' })
        });
    }
    else{
        return res.status(403).send(false);
    }
};

// Search products by name
module.exports.searchProductsByName = async (req, res) => {
    try {
        const { name } = req.body;
        const products = await Product.find({ name: { $regex: name, $options: 'i' } });
        res.status(200).send({ products });
    } catch (error) {
        console.error('Error searching products by name:', error);
        res.status(500).send({ error: 'Failed to search products by name' });
    }
};

// Search products by price range
module.exports.searchProductsByPriceRange = async (req, res) => {
    try {
        const { minPrice, maxPrice } = req.body;
        const products = await Product.find({ price: { $gte: minPrice, $lte: maxPrice } });
        res.status(200).send({ products });
    } catch (error) {
        console.error('Error searching products by price range:', error);
        res.status(500).send({ error: 'Failed to search products by price range' });
    }
};