const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
    userId: {
        type: String,
        required: [true, "User ID is required"]
    },

    productsOrdered: [
        {
            productId:{
                type:String,
                required: [true, "Product ID is required"]
            },
            quantity:{
                type:Number,
                required: [true, "Product quantity is required"]
            },
            subtotal:{
                type:Number,
                required: [true, "Product subtotal is required"]
            }
        }
        
    ],
    totalPrice: {
        type: Number,
        required: [true, "Total Price is required"]
    },
    orederedOn: {
        type: Date,
        default: Date.now
    },
    status: {
        type: String,
        default: "Pending" 
    }
});

module.exports = mongoose.model('Order', orderSchema);


