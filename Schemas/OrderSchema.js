

const mongoose = require('mongoose');



const OrderSchema = new mongoose.Schema({

    u_id :{
        type : String,
        required: true
    },

    order_number  : {
        type : Number,
        required : true,
        unique : true,
        default :  Math.floor(Math.random() *  45676787).toString().padStart(8 , '0')
    
    },
    order_items :{
        type : Array,
        required : true,

    },
    total_amount : {
        type : Number,
        required : true
    },
    address_id : {
        type : String,
        required: true
    },
    time : {
        type : Number,
        required: true,
        default : Number(new Date())
    },
    payment_type : {
        type : String, 
        required : true,
        default  : "Cash"
    }


})


const Order = mongoose.model('orders' , OrderSchema)

module.exports  = Order;