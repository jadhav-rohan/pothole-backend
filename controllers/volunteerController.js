const Volunteer = require("../models/user")

exports.addVolunteer  = (req, res) => {
    const { name, email, mobile} = req.body
    Volunteer.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "Volunteer already registerd!"})
        } else {
            const volunteer = new Volunteer({
                name,
                email,
                mobile 
            })
            volunteer.save(err => {
                if(err) {
                    return res.send(err)
                } 
                else {
                    res.send({message: "Successfully Registered."})
                }
            })
        }
    })
}

