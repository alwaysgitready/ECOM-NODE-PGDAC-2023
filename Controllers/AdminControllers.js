

const ProductSchema  = require('../Schemas/Products')
const OrderSchema = require('../Schemas/OrderSchema')
const UserSchema  = require('../Schemas/UserSchema')
const AddressSchema  = require('../Schemas/AddressSchema')
const {imageHost } = require('../Config/ImageHost')
const bcrypt  = require('bcrypt')
const nodemailer = require("nodemailer");
const jwt = require('jsonwebtoken');
const path = require('path')


const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
      // TODO: replace `user` and `pass` values from <https://forwardemail.net>
      user: "alwaysreadygit@gmail.com",
      pass: "swyhnwagrekmgjdu",
    },
  });



exports.getAllProducts  =(req,res) =>{

    ProductSchema.find({}).then((result)=>{
        res.status(200).send({status :  200 , data   : result})
    }).catch((err)=>{
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    })

}



exports.addProduct  =  (req,res) =>{


    const filePath  =  imageHost + req.file.filename

    const {name , price , discount , category, description , image ,  rating}  = req.body;


    ProductSchema.insertMany({name : name , price : price , discount : discount, category :  category , description :  description ,  image : filePath , rating :rating}).then
    ((result)=>{
        if(result.length  > 0 )
        {
            res.status(200).send({status :200, message : "Product Added Successfully "})
        }
        else{

            res.status(200).send({status :200, message : "Product Not Added || Please Try Again "})

        }
    }).catch((err)=>{


if(err.name == 'ValidationError')
        {
            res.status(400).send({ status : 400, message  :`${err.message.split(":")[1].trim().toUpperCase()} is Required For Registration `})
        }
        else if(err.name == 'MongoBulkWriteError' && err.code  == 11000){
            let a  =  err.message.split(":")[3].replace("{" , "").trim().toUpperCase();
            let b  =  err.message.split(":")[4].replace("}","").replace('"' , "").replace('"' , "");

            res.status(400).send({  status :  400, message  :`Product Already Added with this ${a} : ${b}`})

        }
        else
        {

            res.status(500).send({ status: 500, message : "Something Went Wrong" })
        }
    })

}

exports.editProduct  =  (req,res) =>{




    const {name , price , discount , category, description , image ,  rating , pid}  = req.body;


    ProductSchema.updateOne( {_id : pid} , {$set : {name : name , price : price , discount : discount, category :  category , description :  description ,  image : image , rating :rating}}).then
    ((result)=>{
        if(result.modifiedCount == 1 )
        {
            res.status(200).send({status :200, message : "Product Edited Successfully "})
        }
        else{

            res.status(200).send({status :200, message : "Product Not Edited || Please Try Again "})

        }
    }).catch((err)=>{


if(err.name == 'ValidationError')
        {
            res.status(400).send({ status : 400, message  :`${err.message.split(":")[1].trim().toUpperCase()} is Required For Registration `})
        }
        else if(err.name == 'MongoBulkWriteError' && err.code  == 11000){
            let a  =  err.message.split(":")[3].replace("{" , "").trim().toUpperCase();
            let b  =  err.message.split(":")[4].replace("}","").replace('"' , "").replace('"' , "");

            res.status(400).send({  status :  400, message  :`Product Already Added with this ${a} : ${b}`})

        }
        else
        {

            res.status(500).send({ status: 500, message : "Something Went Wrong" })
        }
    })

}


exports.deleteProduct  = (req,res) =>{

    const {pid}  = req.body;

    ProductSchema.deleteOne({_id  :  pid}).then((result)=>{
        if(result.deletedCount == 1)
        {
            res.status(200).send({status :  200 , messgae : "Product Removed Successfully"})
        }
        else
        {
            res.status(400).send({status :  400 , messgae : "Product Not Deleted"})
        }
    }).catch((err)=>{
            console.log(err)
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    })

}


exports.getDashBoardData  = async (req,res) =>{


    let pd  =  await  ProductSchema.find({}).count()
    let od  =  await  OrderSchema.find({}).count()
    let ud  =  await  UserSchema.find({}).count()

    let dashboardData  =  {
        products  : pd,
        orders : od ,
        users   : ud
    }


    res.status(200).send({status : 200 , data  : dashboardData})




}


exports.getallOrders = (req,res) =>{

OrderSchema.find({}).then((result)=>{

    res.status(200).send({status :  200 , data  :  result})

}).catch((err)=>{
    res.status(500).send({status :  500 , messgae : "Something Went Wrong"})

})



}



exports.getUserDetailsById = (req,res) =>{

    const {u_id}  = req.query

    UserSchema.findOne({_id :  u_id}).then((result)=>{

     res.status(200).send({status : 200 , data  : result})
        
    }).catch((err)=>{
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })

}


exports.getDeliveryAddressById = (req,res) =>{

    const {address_id} =  req.query 

    AddressSchema.findOne({_id :  address_id}).then((result)=>{

        res.status(200).send({status : 200 , data  : result})
           
       }).catch((err)=>{
           res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
       
       })

}


exports.updateProductImage  =  (req, res) =>{

    const {p_id  } = req.body;
    console.log(p_id)
    
    const filePath  =  imageHost + req.file.filename
    console.log(filePath)

    ProductSchema.updateOne({  _id : p_id  } ,  {$set : {image :  filePath}}).then((result)=>{
        if(result.modifiedCount ==1)
        {
            res.status(200).send({status : 200 ,  message : "Image Updated Successfully"  , data : {image : filePath}})
        }
        else
        {
            res.status(400).send({status : 400 ,  message : "Image Not Updated"  })

        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })


}


exports.addVariation  = (req,res) =>{
     const {p_id, index} = req.body

     let filePath   = imageHost  +req.file.filename

    ProductSchema.find({_id : p_id}).then((result)=>{
        let variation_data  =  result[0].variation;

        variation_data[index]  =  filePath


        ProductSchema.updateOne({_id : p_id}  ,  {$set:{variation : variation_data }}).then((result2)=>{
            if(result2.modifiedCount == 1)
            {
                res.status(200).send({status : 200 ,  message : "Image Updated Successfully"  })

            }
            else
            {
                res.status(400).send({status : 400 ,  message : "Image Not Updated"  })

            }
        }).catch((err)=>{
        console.log(err)
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })


    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })

}


exports.getAllUsers  =  (req,res) =>{


    UserSchema.find({}).then((result)=>{
        res.status(200).send({status : 200 , data : result})
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })


}


exports.ActiveInactive   = (req,res) =>{

    const {uid , status } =  req.body

    console.log(req.body)

    UserSchema.updateOne({_id:  uid } ,  {$set : {disable  : status}}).then((result)=>{
        if(result.modifiedCount == 1)
        {
            res.status(200).send({status : 200 , message  :  "User Updated successfully"})

        }
        else
        {
            res.status(400).send({status : 400 , message  :  "User not Updated"})

        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })

}

exports.changePasswordByAdmin  =  (req,res) =>{

    const {_id , new_pass , email ,name} = req.body

    bcrypt.genSalt(10, (err, salt)=>{


        if(err)
        {
            res.status(500).send({status :  500 , messgae : "Something Went Wrong"})

        }
        else
        {
            bcrypt.hash(new_pass, salt , (err, hash)=>{

                if(err)
                {
                    res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
        
                }
                else{

                        UserSchema.updateOne({_id : _id } , {$set:{password : hash}}).then((result)=>{
                            if(result.modifiedCount == 1)
                            {
                                transporter.sendMail({
                                    from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                                    to: email, // list of receivers
                                    subject: "Password Reset By Admin ✔", // Subject line
                                    text: `Hi , ${name}`, // plain text body
                                    html: `<h1>Your Password has been changed by Admin , Your New Password is : ${new_pass}</h1>`, // html body
                                  }).then((mail_result)=>{
                                
                                    if(mail_result.messageId){
                                
                                        res.status(200).send({status : 200 , message  :"Password Updated & Mail sent"})
                                    }
                                    else
                                    {
                                        res.status(500).send({status : 400 , message  :"Password Updated But Mail Not Send"})
                                
                                    }
                                
                                  }).catch((err)=>{
                                    console.log(err)
                                    res.status(500).send({status : 400 , message  :"Password Updated But Mail Not Send"})
                                
                                  })

                            }
                            else
                            {
                                res.status(400).send({status :  400 , messgae : "Password Not Updated"})
    
                            }
                        }).catch((err)=>{
                            console.log(err)
                            res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
                        
                        })

                }

            })
        }

    })



}


const Secure_key  =  '#$%2023$%&*BHA@#)$%^&**#$3'


exports.gen_Jwt  =  (req,res) =>{

    const data  = req.body;

   let token  =  jwt.sign(data , Secure_key, {expiresIn :"20s"} )

   res.send({token  :  token})


  

}


exports.verify_jwt = (req,res)=>{

    const {token} =req.body;

   let data  =   jwt.verify(token , Secure_key)

   res.send(data)

}


// const pwd_form = require('../Html_Pages/P')


exports.password_reset_form = (req,res) =>{

    console.log(req.params)

      jwt.verify(req.params.id , Secure_key , (err, data)=>{
        if(err)
        {
            res.status(401).send('<h1 style="text-align:center;color:red">This Link Has Expired ? Request a new Link</h1>')
            
        }
        else
        {
            console.log(data)
            res.sendFile(path.join(__dirname,'../Html_Pages/Password_reset_form.html'))
        }
      })


    



    

}




exports.send_password_reset_link  =  (req,res) =>{

  const   {u_id , email , name } = req.body;

  let random_token  =   jwt.sign({user_id : u_id  , email : email , name : name} , Secure_key , {expiresIn :  "60s"})

  let base_url =  'http://localhost:9800/admin/password_reset_form/'


  transporter.sendMail({
    from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
    to: email, // list of receivers
    subject: "Password Reset Link By Admin ✔", // Subject line
    text: `Hi , ${name}`, // plain text body
    html: `<h1>
     Click on below URL to reset your password
    </h1>
    <br>
    <a href=${base_url +  random_token} >Reset Your Passsword Here </a>
    `, // html body
  }).then((mail_result)=>{

    if(mail_result.messageId){

        UserSchema.updateOne({_id :  u_id} ,  {$set :{have_pwd_reset_link  : true}}).then((result2)=>{
            if(result2.matchedCount == 1)
            {

                res.status(200).send({status : 200 , message  :"Mail sent & Status Updated"})
            }
            else
            {
                res.status(200).send({status : 200 , message  :"Mail sent but Status not Updated"})
 
            }
        }).catch((err)=>{
            res.status(200).send({status : 200 , message  :"Mail sent but Status not Updated"})

        })

    }
    else
    {
        res.status(500).send({status : 400 , message  :" Mail Not Send"})

    }

  }).catch((err)=>{
    console.log(err)
    res.status(500).send({status : 400 , message  :" Mail Not Send"})

  })




}

exports.changePasswordByLink  = (req,res) =>{


    const   {new_pass , confirm_pass ,  token_url}  = req.body

    console.log(req.body)

    if(! new_pass || ! confirm_pass)
    {
        res.status(400).send(  {status : 400  , message : "New Password & Confirm Password is Required"})

    }
    else
    {
        if(new_pass != confirm_pass)
        {
            res.status(400).send(  {status  : 400 , message  :"New Password & Confirm password Didn't match"})
        }
        else
        {

            bcrypt.genSalt(10, (err , salt)=>{

                if(err)
                {
                    res.status(500).send( {status  : 400 , message  :"Something Went Wrong || Try again"} )
                }
                else
                {
                    bcrypt.hash(new_pass , salt , (err, hash)=>{

                        if(err)
                        {
                            res.status(500).send({status  : 400 ,message  :"Something Went Wrong || Try again"})

                        }
                        else{


                       let token = token_url.split('/')[5]     
                            
      jwt.verify(token , Secure_key , (err, data)=>{
        if(err)
        {
            res.status(401).send({status  : 401 ,message  :"Session Expired"})
            
        }
        else
        {
            console.log(data)
            
            UserSchema.updateOne({_id :  data.user_id} ,  {$set :{have_pwd_reset_link  : false , password : hash}}).then((result2)=>{
                if(result2.matchedCount == 1)
                {
    
                    transporter.sendMail({
                        from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                        to: data.email, // list of receivers
                        subject: "Password Reset Link By Admin ✔", // Subject line
                        text: `Hi , ${data.name}`, // plain text body
                        html: `<h1>
                         Hi ${data.name}  your password has reset successfully.
                        </h1>
                        
                    
                        `, // html body
                      }).then((mail_result)=>{
                    
                        if(mail_result.messageId){
                    
                            UserSchema.updateOne({_id :  u_id} ,  {$set :{have_pwd_reset_link  : true}}).then((result2)=>{
                                if(result2.matchedCount == 1)
                                {
                    
                                    res.status(200).send({status : 200 , message  :"Password Updated"})
                                }
                                else
                                {
                                    res.status(200).send({status : 200 , message  :"Password Updated"})
                     
                                }
                            }).catch((err)=>{
                                res.status(200).send({status : 200 , message  :"Password Updated"})
                    
                            })
                    
                        }
                        else
                        {
                            res.status(500).send({status : 200 , message  :"Password Updated"})
                    
                        }
                    
                      }).catch((err)=>{
                        console.log(err)
                        res.status(500).send({status : 200 , message  :"Password Updated"})
                    
                      })
                }
                else
                {
                    res.status(200).send({status : 200 , message  :"Password not Updated"})
     
                }
            }).catch((err)=>{
                res.status(200).send({status : 200 , message  :"Soemthing Went Wrong"})
    
            })
    


        }
      })

                        }

                    })
                }
            })
    
        }
    }
    


  


}


exports.showSuccessMessage  = (req,res) =>{

    res.status(200).send(`<h1 style="text-align:center;color:green">Password Reset Successfully</h1>`)

}
