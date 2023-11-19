const mongoose  = require('mongoose');




const ProductSchema  =  new mongoose.Schema({


    name  : {
        type : String, 
        required : true,
        unique :  true
    },

    price  :{
        type : Number ,
        required : true
    },
    discount :  {
        type : Number , 
        require : true
    },
    description  :  {
        type : String , 
        require : true 
    },

    category  : {
        type : String , 
        required : true,
    },
    image : {
        type : String,
        required : true
    },
    rating : {
        type : Number,
        required: true
    },
    variation :{
        type : Array ,
    }





})


const Product  =  mongoose.model('products' , ProductSchema)


module.exports = Product
