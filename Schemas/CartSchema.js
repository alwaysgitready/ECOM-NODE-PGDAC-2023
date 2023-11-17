const mongoose = require('mongoose');




const CartSchema  =  new mongoose.Schema({

    u_id  : {
        type : String,
        required  : true,

    },
    p_id  :{
        type : String, 
        required :  true
    },
    time   :{
        type : Number,
        default  :  Number(new Date()),
        required : true
    },
    quantity : {
        type :Number,
        default : 1,
        required : true
    }

})


const Cart  = mongoose.model('carts'  , CartSchema)

module.exports = Cart;







