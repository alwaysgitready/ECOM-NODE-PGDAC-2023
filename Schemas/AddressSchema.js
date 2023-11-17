
const mongoose  = require('mongoose')


const AddressSchema  =  new mongoose.Schema({

    u_id: {
        type : String , 
        required : true
    },
    house_or_flat : {
        type : String , 
        required : true
    },
    street:{
        type : String , 
        required : true
    },
    landmark : {
        type : String , 
        required : true
    },
    pincode :{
        type : String , 
        required : true
    },
    country :{
        type : String , 
        required : true
    },
    state :{
        type : String , 
        required : true
    },
    city:{
        type : String , 
        required : true
    },
    lat : {
        type : String , 
        
    },
    log:{
        type : String , 
        
    }


    
})

const Address  =  mongoose.model('addresses' ,  AddressSchema);

module.exports  = Address;