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

    return Products.find({})
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