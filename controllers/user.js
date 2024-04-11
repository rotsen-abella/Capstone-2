const User = require("../models/User");
const auth = require('../auth');
const bcrypt = require("bcrypt");

module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

    return User.findById(userId)
    .then(user => {
    	if (!user) {
    	    return res.status(404).send({ error: 'User not found' });
    	}

        result.password = "";
        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};

module.exports.updateUserAsAdmin = async (req, res) => {
    const { userId } = req.body;

    try {
        // Find the user by userId and update its isAdmin field to true
        const updatedUser = await User.findById(userId);

        if (!updatedUser) {
            return res.status(404).json({ message: "User not found" });
        }
        updatedUser.isAdmin = true;
        await updatedUser.save();
        return res.status(200).json({ message: "User updated as admin successfully" });
    } catch (error) {
        console.error("Error updating user as admin:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};
module.exports.updatePassword = async (req, res) => {
    const { userId } = req.params;
    const { newPassword } = req.body;

    try {
        // Find the user by userId
        let user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        // Update the user's password
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ message: "User password updated successfully" });
    } catch (error) {
        console.error("Error updating user password:", error);
        return res.status(500).json({ message: "Internal server error" });
    }
};