const bcrypt = require("bcrypt")
const User = require("../models/user");
const jwt = require("jsonwebtoken");
var nodemailer = require('nodemailer');

const JWT_SECRET = "secret"
// yqmigcelmruaxrxa
exports.signup  = (req, res) => {
    const { name, email, password} = req.body
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
                role: 0
            })
            user.save(err => {
                if(err) {
                    return res.send(err)
                } 
                else {
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

                        const {_id, name, email, role} = user;
                        return res.status(200).send({
                            msg: "Login Successful...!",
                            // name: user.name,
                            // role: user.role,
                            token,
                            user: {_id, name, email, role}
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
              pass: 'yqmigcelmruaxrxa'
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
              console.log(error);
              res.status(400).send({error: "User not registered!"})
            } else {
                res.status(200).send({msg: "Email Sent!"})
              console.log('Email sent: ' + info.response);
            }
          });
        // console.log(link)
     }
     catch(error) {}
}

exports.resetPassword = async (req, res) => {
    const {id, token} = req.params;
    console.log(req.params)
    // res.send("Done") 

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
