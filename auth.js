const jwt = require("jsonwebtoken");

const secret = "ECommerceAPI";

module.exports.createAccessToken = (user) => {
	const data = {
		id: user._id,
		email: user.email,
		isAdmin: user.isAdmin
	};

	// The sign() function is responsible for creating a token using the user data, secret key, and options/modifiers for the token (which is represented by the empty object).
	return jwt.sign(data, secret, {});
}
module.exports.verify = (req, res, next) => {
	console.log(req.headers.authorization);

	let token = req.headers.authorization;
	// console.log("This is the token", token)

	if(typeof token === "undefined") {
		return res.send({auth: "Failed. No Token."})
	} else {

		console.log(token);
		token = token.slice(7, token.length);
		console.log(token);

		// Token decryption
		jwt.verify(token, secret, function(err, decodedToken) {

			if(err) {
				return res.send({
					auth: "Failed",
					message: err.message
				})
			} else {
				console.log("Result from verify method:")
				console.log(decodedToken);

				req.user = decodedToken;
				// console.log("This is the req.user:" + req.user);

				next();
			}
		})
	}
}


module.exports.verifyAdmin = (req, res, next) => {
	console.log("Result from verifyAdmin method:");
	console.log(req.user)

	// Checks if the owner of the token is an admin
	if(req.user.isAdmin) {
		// move to the next middleware
		next();

	// If not admin, send the status and message
	} else {
		return res.status(403).send({
			auth: "Failed",
			message: "Action Forbidden"
		})
	}
}

// Middleware to check if the user is authenticated
module.exports.isLoggedIn = (req, res, next) => {
	if(req.user){
		next();
	}  else {
		res.sendStatus(401);
	}
}


module.exports.verifyAdminToken = (req, res, next) => {
    // Verify admin token logic
    // Assuming you have a function to verify admin token
};

// Middleware to check if user is admin
module.exports.isAdmin = (req, res, next) => {
    // Check if user is admin logic
    // Assuming you have a function to check if user is admin
};