const bcrypt = require("bcrypt")
const User = require("../models/user");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');
const Token = require("../models/token");
const crypto = require("crypto");
const sendEmail = require("../utils/sendEmail");

const JWT_SECRET = "secret"
// yqmigcelmruaxrxa
exports.signup  = async (req, res) => {
    // const { name, email, password} = req.body
    // User.findOne({email: email}, (err, user) => {
    //     if(user){
    //         res.send({code: 404, message: "User already registerd"})
    //     } else {
    //         const salt = bcrypt.genSaltSync(10);
    //         const hash = bcrypt.hashSync(password, salt);

    //         const user = new User({
    //             name,
    //             email,
    //             password: hash, 
    //             role: 0
    //         })
    //         user.save(err => {
    //             if(err) {
    //                 return res.send({message: "Erro"})
    //             }
    //             else {
    //                 res.send({code: 200, message: "Successfully Registered, Please login now."})
    //             }
    //         })
    //     }
    // })
    try {
		const { error, email, mobile } = (req.body);
		if (error)
			return res.status(400).send({ message: error.details[0].message });

		let user = await User.findOne({ email: req.body.email });
		if (user)
			return res
				.status(409)
				.send({ message: "User with given email already Exist!" });

		const salt = await bcrypt.genSalt(Number(process.env.SALT));
		const hashPassword = await bcrypt.hash(req.body.password, salt);

		user = await new User({ ...req.body, password: hashPassword }).save();
        console.log(mobile)
		const token = await new Token({
			userId: user._id,
			token: crypto.randomBytes(32).toString("hex"),
		}).save();
		const link = `${process.env.BASE_URL}/${user.id}/verify/${token.token}`;
		
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rohanj2424@gmail.com',
              pass: 'uhgmxmbejpapbhhz'
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Email Verifation',
            text: "Verify your email by clicking on this link: " + link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log("jhdf",error);
              res.status(400).send({error: "User not registered!"})
            } else {
                res.status(200).send({message: "Email Sent!"})
              console.log('Email sent: ' + info.response);

            }
          });
	} catch (error) {
		console.log(error);
		res.status(500).send({ message: "Internal Server Error" });
	}

}

exports.verify = async (req, res) => {
    try {
		const user = await User.findOne({ _id: req.params.id });
    // console.log(req.params.id)
		if (!user) return res.status(400).send({ message: "Invalid link" });
    // console.log(user)
		const token = await Token.findOne({
			userId: user._id,
			token: req.params.token,
		});
    console.log("token", token.userId)
		if (!token) return res.status(400).send({ message: "Invalid link" });

		await User.updateOne({ _id: user._id}, {$set:{verified: true}});
		await token.remove();
    console.log("first")
		res.status(200).send({ message: "Email verified successfully" });
	} catch (error) {
		res.status(500).send({ message: "Internal Server Error" });
	}
}

exports.login = (req,res) => {
    const { email, password } = req.body;
    const user = User.findOne({email: email})
    try {
        User.findOne({ email: email })
            .then(user => {
                bcrypt.compare(password, user.password)
                    .then(passwordCheck => {

                        if(!passwordCheck) return res.send({code: 400, message: "Password does not Match"});

                        // create jwt token
                        const token = jwt.sign({
                                        userId: user._id,
                                        name : user.name
                        }, 'secret' , { expiresIn : "24h"});

                        if(!user.verified){
                            return res.send({code: 400, message: "Please verify your email!"})
                        }
                        const {_id, name, email, role} = user;
                        return res.send({
                            code: 200,
                            message: "Login Successful...!",
                            token: token,
                            role: role,
                            email: email
                        });                                    
                    })
                    .catch(error => {
                        return res.send({ code: 400, message: "Password does not Match"})
                    })
            })
            .catch( error => {
                return res.send({code: 404, message : "Username not Found"});
            })

    } catch (error) {
        return res.status(500).send({ message: "eoororoor"});
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

exports.forgetPassword = async (req, res) => {
     const {email} = req.body;

     try{
        const oldUser = await User.findOne({email});

        if(!oldUser){
            return res.json({status: "User not registered!"})
        }

        const secret = JWT_SECRET + oldUser.password;

        const token = jwt.sign({email : oldUser.email, id: oldUser._id}, secret , {
            expiresIn: "5m"
        });

        const link = `http://localhost:9002/api/reset-password/${oldUser._id}/${token}`;
        var transporter = nodemailer.createTransport({
            service: 'gmail',
            auth: {
              user: 'rohanj2424@gmail.com',
              pass: 'urayzdshlrnpxmuv'
            }
          });
          
          var mailOptions = {
            from: 'youremail@gmail.com',
            to: email,
            subject: 'Password Reset Link',
            text: link
          };
          
          transporter.sendMail(mailOptions, function(error, info){
            if (error) {
              console.log("jhdf",error);
              res.status(400).send({error: "User not registered!"})
            } else {
                res.status(200).send({msg: "Email Sent!"})
              console.log('Emasil sent: ' + info.response);

            }
          });
        // console.log(link)
     }
     catch(error) {}
}

exports.resetPassword = async (req, res) => {
    const {id, token} = req.params;
    console.log(req.params)
    // res.se   nd("Done") 

    const oldUser = await User.findOne({_id: id});
    if(!oldUser){
        return res.json({status: "User not registered!"})
    }
    const secret = JWT_SECRET + oldUser.password;
    try{
        const verify = jwt.verify(token,secret)
        // res.send("Verified")
        res.render("index", { email: verify.email, status: "Not Verified" });
    }catch (error){
        console.log(error);
        res.send("Not Verified");
    }
}

exports.resetPasswordPost =  async (req, res) => {

    const {id, token} = req.params;
    const {password} = req.body;

    const oldUser = await User.findOne({_id: id});
    if(!oldUser){
        return res.json({status: "User not registered!"})
    }
    const secret = JWT_SECRET + oldUser.password;
    try{
        console.log(password)
        const verify = jwt.verify(token,secret)
        const salt = bcrypt.genSaltSync(10);
        const hash = bcrypt.hashSync(password, salt);

        await User.updateOne({
            _id: id,
        },
        {
            $set: {
                password: hash,
            }
        })
        console.log(hash);
        res.render("index", { email: verify.email, status: "Not Verified" });
    }catch (error){
        console.log(error);
        res.send("Something went wrong");
    }
};

exports.isAdmin = (req, res, next) => {
    if (req.user.role === 0) {
      return res.status(403).json({
        error: "You are not admin, Access Denied!",
      });
    }
    next();
};
