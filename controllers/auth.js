const bcrypt = require("bcrypt")
const User = require("../models/user");
const jwt = require("jsonwebtoken");


exports.signup  = (req, res) => {
    const { name, email, password, mobile} = req.body
    User.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "User already registerd"})
        } else {
            const salt = bcrypt.genSaltSync(10);
            const hash = bcrypt.hashSync(password, salt);

            const user = new User({
                name,
                email,
                password: hash,
                mobile 
            })
            user.save(err => {
                if(err) {
                    return res.send(err)
                } 
                else {
                    // console.log("Success!")
                    res.send({message: "Successfully Registered, Please login now."})
                }
            })
        }
    })
}

exports.login = (req,res) => {
    const { email, password } = req.body;
    try {
        User.findOne({ email: email })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.status(400).send({ error: "Don't have Password"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        name : user.name
                                    }, 'secret' , { expiresIn : "24h"});

                        return res.status(200).send({
                            msg: "Login Successful...!",
                            name: user.name,
                            token
                        });                                    
                    })
                    .catch(error => {
                        return res.status(400).send({ error: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.status(404).send({ error : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ error: "eoororoor"});
    }
}

exports.signout = (req, res) => {
    res.clearCookie("token");
    res.json({
      message: "User signout Succesfull!",
    });
};

exports.isAuthenticated = (req, res, next) => {
    let checker = req.porfile && req.auth && req.porfile._id == req.auth._id;
    if (!checker) {
      return res.status(403).json({
        error: "Access Denied!",
      });
    }
    next(); //next is responsible for transferring the control form one middleware to another
  };

