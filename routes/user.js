const express = require("express");
const userController = require("../controllers/user");
const { verify, verifyAdmin } = require("../auth");
const router = express.Router();

// Route for registering a new user into the database
router.post("/", userController.registerUser);

// Route for logging in an existing user in the database
router.post("/login", userController.loginUser);

router.get("/details", verify, userController.getProfile);

router.patch("/:id/set-as-admin", verify, verifyAdmin, userController.updateUserAsAdmin);

router.patch('/update-password', verify, userController.updatePassword);


module.exports = router;

