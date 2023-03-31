const Volunteer = require("../models/volunteerSchema")

exports.addVolunteer  = (req, res) => {
    const { firstName, lastName, email, mobile, message} = req.body
    Volunteer.findOne({email: email}, (err, user) => {
        if(user){
            res.send({message: "Volunteer already registerd!"})
        } else {
            const volunteer = new Volunteer({
                firstName,
                lastName,
                email,
                mobile,
                message
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

