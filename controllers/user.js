const User = require("../models/User");
const auth = require('../auth');
const bcrypt = require("bcrypt");

//Controller for registering a new user
module.exports.registerUser = (req, res) => {
    if(!req.body.email.includes("@")){
        return res.status(400).send({error: "Email is invalid"});
    }
    else if(req.body.mobileNo.length !== 11){
        return res.status(400).send({error: "Mobile number invalid"});
    }
    else if(req.body.password.length < 8){
        return res.status(400).send({error: "Password must be at least 8 characters long"})
    }
    else{
        let newUser = new User({
            firstName: req.body.firstName,
    		lastName: req.body.lastName,
    		email: req.body.email,
    		mobileNo: req.body.mobileNo,
    		password: bcrypt.hashSync(req.body.password, 10)
        })

        return newUser.save()
        .then((result) => res.status(201).send({message: "Registered Successfully"}))
        .catch(err => {
            console.error("Error in saving: ", err)
            return res.status(500).send({error: "Error in save"})
        });
    }
}


module.exports.loginUser = (req, res) => {


	if(req.body.email.includes("@")){

		return User.findOne({email: req.body.email})
		.then(result => {
			if(result == null){
				return res.status(404).send({ error: "No Email Found" });
			} 
            else {
				const isPasswordCorrect = bcrypt.compareSync(req.body.password, result.password);

				if(isPasswordCorrect){
					return res.status(200).send({access: auth.createAccessToken(result)});
				} else {
					return res.status(401).send({ message: "Email and password do not match" });
				}
			}
		}).catch(err => {
			console.error("Error in find: ", err)
            return res.status(500).send({ error: "Error in find"})
		});
	}
    else{
		return res.status(400).send({error: "Invalid Email"})
	}
}