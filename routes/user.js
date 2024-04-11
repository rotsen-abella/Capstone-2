const express = require("express");
const userController = require("../controllers/user");
const { verify } = require("../auth");
const router = express.Router();

//Route for registering a new user
router.post("/", userController.registerUser);

//Route for loggin in an exisitng user
router.post('/login', userController.loginUser);


module.exports = router;