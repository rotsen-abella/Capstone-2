const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({

    userId: {
        type: String,
        required: [true, "User ID is required"]
    },
    
    cartItems: [
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
    }

})
module.exports = mongoose.model('Cart', cartSchema);
