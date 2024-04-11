const express = require("express");
const passport = require('passport');
const userController = require("../controllers/user");
const { verify, isLoggedIn } = require("../auth");
const router = express.Router();

router.get("/details", verify, userController.getProfile);

router.put("/:userId/set-as-admin", verify, userController.updateUserAsAdmin);

router.put('/update-password', verify, userController.updatePassword);
module.exports = router;

