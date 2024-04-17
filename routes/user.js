const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

// Route for registering a new user into the database
router.post("/", userController.registerUser);

// Route for logging in an existing user in the database
router.post("/login", userController.loginUser);

//Route for getting user details
router.get("/details", verify, userController.getProfile);

//Route for updating user to Admin
router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

//Route for updating password
router.patch('/update-password', verify, userController.updatePassword);

module.exports = router;


//*********************STRETCH GOALS***********************************

