const mongoose  = require('mongoose');



const OtpSchema   = new mongoose.Schema({

    u_id : {
        type  : String,
        required :  true
    },
    otp : {

        type : Number,
        required  :true
    },
    time : {

        type   :Number,
        required : true
    }


})


const Otp  =  mongoose.model("otp" , OtpSchema)

module.exports   = Otp