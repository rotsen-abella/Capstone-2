const User = require("../models/User");
const Cart = require("../models/Cart");
const auth = require('../auth');
const bcrypt = require("bcrypt");
const { v4: uuidv4 } = require('uuid');
const { sendResetPasswordEmail } = require('../utils/email');


module.exports.registerUser = (req, res) => {

	
    if (!req.body.email.includes("@")){
        return res.status(400).send({ error: "Email invalid" });
    }
    
    else if (req.body.mobileNo.length !== 11){
        return res.status(400).send({ error: "Mobile number invalid" });
    }
    
    else if (req.body.password.length < 8) {
        return res.status(400).send({ error: "Password must be atleast 8 characters" });
    
    } else {
    	
    	let newUser = new User({
    		firstName: req.body.firstName,
    		lastName: req.body.lastName,
    		email: req.body.email,
    		mobileNo: req.body.mobileNo,
    		password: bcrypt.hashSync(req.body.password, 10)
    	})

    	
    	return newUser.save()
    	.then((result) => res.status(201).send({ message: "Registered Successfully" }))
    	
    	.catch(err => {
    		console.error("Error in saving: ", err)
            return res.status(500).send({ error: "Error in save"})		            
    	});
    }

}

module.exports.loginUser = (req, res) => {


	if(req.body.email.includes("@")){

		return User.findOne({email: req.body.email})

		.then(result => {

			
			if(result == null){

				return res.status(404).send({ error: "No Email Found" });

			} else {
				
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				
				if(isPasswordCorrect){
					return res.status(200).send({accessToken: auth.createAccessToken(result)});
				} else {
					return res.status(401).send({ message: "Email and password do not match" });
				}
			}
		}).catch(err => {
			console.error("Error in find: ", err)
            return res.status(500).send({ error: "Error in find"})
		});
	}else{
		return res.status(400).send({error: "Invalid Email"})
	}
}


module.exports.getProfile = (req, res) => {
	const userId = req.user.id;

    return User.findById(userId)
    .then(user => {
    	if (!user) {
    	    return res.status(404).send({ error: 'User not found' });
    	}

        user.password = "";
        return res.status(200).send({ user });
    })
    .catch(err => {
    	console.error("Error in fetching user profile", err)
        return res.status(500).send({ error: 'Failed to fetch user profile' })
    });
};

module.exports.updateUserAsAdmin = async (req, res) => {
    const { id } = req.params;

    try {
        // Find the user by userId and update its isAdmin field to true
        const updatedUser = await User.findById(id);

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
    try {
        const { newPassword } = req.body;
        const { id } = req.body; 
           
        const hashedPassword = await bcrypt.hash(newPassword, 10);
            
        await User.findByIdAndUpdate(id, { password: hashedPassword });
        
        res.status(200).json({ message: 'Password updated successfully' });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
      }
    };

module.exports.requestPasswordReset = async (req, res) => {
    try {
        const { email } = req.body;

        // Check if the user with the provided email exists
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Generate a unique token for password reset
        const token = uuidv4();

        // Save the token to the user document
        user.passwordResetToken = token;
        await user.save();

        // Send password reset email with token
        await sendResetPasswordEmail(user.email, token);

        res.status(200).json({ message: 'Password reset email sent successfully' });
    } catch (error) {
        console.error('Error requesting password reset:', error);
        res.status(500).json({ error: 'Failed to request password reset' });
    }
};
// Controller for resetting password with email confirmation
module.exports.resetPassword = async (req, res) => {
    try {
        const { email, token, newPassword } = req.body;

        // Find the user with the provided email and password reset token
        const user = await User.findOne({ email, passwordResetToken: token });
        if (!user) {
            return res.status(404).json({ error: 'Invalid or expired token' });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(newPassword, 10);

        // Update user's password and clear the password reset token
        user.password = hashedPassword;
        user.passwordResetToken = undefined;
        await user.save();

        res.status(200).json({ message: 'Password reset successful' });
    } catch (error) {
        console.error('Error resetting password:', error);
        res.status(500).json({ error: 'Failed to reset password' });
    }
};