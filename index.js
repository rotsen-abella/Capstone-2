const express = require('express');
const mongoose = require ('mongoose');
const cors = require("cors");

//Access to routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart")
const orderRoutes = require("./routes/order")

const port = 4001;

const app = express();


//MongoDb Connection


mongoose.connect("mongodb+srv://admin:admin123@b402-course-booking.ywsrv4a.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-course-booking");


//[Connection String (Miranda)]
//mongodb+srv://admin:admin123@b402-course-booking.3ncrnzy.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-Course-Booking

//[Connection String (Abella)]
//mongodb+srv://admin:admin123@b402-course-booking.ywsrv4a.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-course-booking




let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use(cors());

//Routes
app.use('/b1/users', userRoutes);
app.use('/b1/products',productRoutes);
app.use('/b1/cart',cartRoutes);
app.use('/b1/orders',orderRoutes);




if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on ${process.env.PORT || port}`);
    })
}

module.exports = {app, mongoose};