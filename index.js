const express = require('express');
const mongoose = require ('mongoose');

//Access to routes
const userRoutes = require("./routes/user");
const productRoutes = require("./routes/product");
const cartRoutes = require("./routes/cart")

const port = 4000;

const app = express();


//MongoDb Connection


mongoose.connect("mongodb+srv://admin:admin123@b402-course-booking.3ncrnzy.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-Course-Booking");


//[Connection String (Miranda)]
//mongodb+srv://admin:admin123@b402-course-booking.3ncrnzy.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-Course-Booking

//[Connection String (Abella)]
//mongodb+srv://admin:admin123@b402-course-booking.ywsrv4a.mongodb.net/ecommerce-api?retryWrites=true&w=majority&appName=B402-course-booking




let db = mongoose.connection;
db.on("error", console.error.bind(console, "connection error"));
db.once("open", () => console.log("Now connected to MongoDB Atlas"));

app.use(express.json());
app.use(express.urlencoded({extended:true}));

//Routes
app.use('/users', userRoutes);
app.use('/products',productRoutes);
app.use('/carts',cartRoutes);



if(require.main === module){
    app.listen(process.env.PORT || port, () => {
        console.log(`API is now online on ${process.env.PORT || port}`);
    })
}

module.exports = {app, mongoose};