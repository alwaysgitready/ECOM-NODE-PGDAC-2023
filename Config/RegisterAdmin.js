const UserSchema  = require('../Schemas/UserSchema')
const bcrypt = require('bcrypt')



function RegisterAdmin(){

    console.log("**************Checking and Registering Admin**************")


    const {name  , email , mobile , password }  = {name  :"Admin" ,  email : "admin@gmail.com" ,  mobile:"9090909091"  , password : "admin@123"}


    if(!password  )
    {
        console.log({status : 400 , message : "Please Provide Password"})
    }
    else
    {
    
        bcrypt.genSalt(10 , (err , salt)=>{
    
            if(err){
                console.log({status : 500 , message : "Something Went Wrong Please Try again"})
            }
            else{
    
                bcrypt.hash(password ,  salt ,  (err  , hash)=>{
                    if(err)
                    {
                        console.log({status : 500 , message : "Something Went Wrong Please Try again"})
    
                    }else{
    UserSchema.insertMany({name  : name ,  email  : email,  mobile : mobile ,  password :hash ,  role : "Admin"}).then((result)=>{
    
            if(result.length > 0)
            {
    
            
                
                console.log({ status : 200, message : "Admin Registerd Successfully"})
    
            }
            else
            {
                console.log({ status:  400 , message : "Admin Not Registerd" })
    
            }
    
        }).catch((err)=>{
    
    
            if(err.name == 'ValidationError')
            {
                console.log({ status : 400, message  :`${err.message.split(":")[1].trim().toUpperCase()} is Required For Registration `})
            }
            else if(err.name == 'MongoBulkWriteError' && err.code  == 11000){
                let a  =  err.message.split(":")[3].replace("{" , "").trim().toUpperCase();
                let b  =  err.message.split(":")[4].replace("}","").replace('"' , "").replace('"' , "");
    
                console.log({  status :  400, message  :`Admin Already Registerd with this ${a} : ${b}`})
    
            }
            else
            {
    
                console.log({ status: 500, message : "Something Went Wrong" })
            }
    
    
    
    
        })
                    }
                })
            }
        })
    
    }
    
    
    console.log("**************Checking and Registering Admin**************")
}


RegisterAdmin()