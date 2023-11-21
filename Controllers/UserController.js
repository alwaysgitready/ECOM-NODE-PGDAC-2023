const PORT   = 9800
const User = require('../Schemas/UserSchema')
const UserSchema  = require('../Schemas/UserSchema')
const bcrypt  = require('bcrypt')
const OtpSchema   = require('../Schemas/OtpSchema')
const ProductSchema = require('../Schemas/Products')
const CartSchema  =  require('../Schemas/CartSchema')
const AddressSchema  = require('../Schemas/AddressSchema')
const OrderSchema = require('../Schemas/OrderSchema')
const {imageHost}  = require('../Config/ImageHost')
const nodemailer = require("nodemailer");

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


exports.CallRootPath = (req,res) =>{

    res.send(`<h1>Hi, This is a Node Js Server  Running on PORT : ${PORT}</h1>`)

}

exports.callTest = (req,res) =>{
    res.send(`
    <form method='GET'  action='/test_odd_even' >
        <input  placeholder='Enter any Number' name='number'  >
        <input  placeholder='Enter Your Name' name='name'  >
        <input  placeholder='Enter Your Email' name='email'  >
        <input  placeholder='Enter Your Mobile' name='mobile'  >
        <input type='password'  placeholder='Enter Your Password' name='password' >
        <br>
        <button type='submit' >Check</button>
    </form>
    `)
}

exports.ShowTestResultOddEven  = (req,res) =>{

    if(req.query.number % 2 ==  0)
    {
        
        res.send(` <p>Hi , ${req.query.name} , your mobile number is ${req.query.mobile} and email is ${req.query.email}</p>  <h1  style="color:green" >${req.query.number} is an Even Number`)
    }
    else{
        res.send(`<p>Hi , ${req.query.name} , your mobile number is ${req.query.mobile} and email is ${req.query.email}</p><h1 style="color:red">${req.query.number} is an Odd Number`)
        
    }


}


exports.ShowPostForm  = (req,res) =>{
    res.send(
        `

        <form  method='POST' , action='/test-form-result' >
        <input placeholder='Enter Your Name' name='name' />
        <input type='password' placeholder='Enter Your Password' name='password' />
        <button>Submit</button>
        </form>
        
        `
    )


}


exports.showPostFormResult = (req,res) =>{
    console.log(req.body)



    res.send("hi")

}




exports.AddUser  = (req,res) =>{

const {name  , email , mobile , password }  = req.body


if(!password  )
{
    res.status(400).send({status : 400 , message : "Please Provide Password"})
}
else
{

    bcrypt.genSalt(10 , (err , salt)=>{

        if(err){
            res.status(500).send({status : 500 , message : "Something Went Wrong Please Try again"})
        }
        else{

            bcrypt.hash(password ,  salt ,  (err  , hash)=>{
                if(err)
                {
                    res.status(500).send({status : 500 , message : "Something Went Wrong Please Try again"})

                }else{
UserSchema.insertMany({name  : name ,  email  : email,  mobile : mobile ,  password :hash}).then((result)=>{

        if(result.length > 0)
        {

            transporter.sendMail({
                from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                to: email, // list of receivers
                subject: "Registration Done ✔", // Subject line
                text: `Hi , ${name}`, // plain text body
                html: `<h1>Hi , ${name} Your Registration has done Successfully on Node JS PGDAC Portal</h1>`, // html body
              }).then((mail_result)=>{
            
                if(mail_result.messageId){
            
                    res.status(200).send({ status : 200, message : "User Registerd Successfully"})
                }
                else
                {
                    res.status(500).send({status : 400 , message  :"Registration Failed"})
            
                }
            
              }).catch((err)=>{
                console.log(err)
                res.status(500).send({status : 400 , message  :"Registration Failed"})
            
              })

        }
        else
        {
            res.status(400).send({ status:  400 , message : "User Not Registerd" })

        }

    }).catch((err)=>{

        console.log(err.code )
        console.log(err.name)
        console.log(err.message)

        if(err.name == 'ValidationError')
        {
            res.status(400).send({ status : 400, message  :`${err.message.split(":")[1].trim().toUpperCase()} is Required For Registration `})
        }
        else if(err.name == 'MongoBulkWriteError' && err.code  == 11000){
            let a  =  err.message.split(":")[3].replace("{" , "").trim().toUpperCase();
            let b  =  err.message.split(":")[4].replace("}","").replace('"' , "").replace('"' , "");

            res.status(400).send({  status :  400, message  :`User Already Registerd with this ${a} : ${b}`})

        }
        else
        {

            res.status(500).send({ status: 500, message : "Something Went Wrong" })
        }




    })
                }
            })
        }
    })

}
}





exports.userLogin = (req,res) =>{

    const {email , password} =  req.body

    UserSchema.find({email  : email}).then((result)=>{

       if(result.length >  0)
       {


            if(result[0].disable == true)
            {
                res.status(401).send({status : 401 , message  :"Login is disabled By Admin || Please Contact to Admin for  Enableing Process "})

            }
            else
            {

                bcrypt.compare(password  ,result[0].password  , (err  , auth)=>{

                    if(err){
                        res.status(500).send({status : 500 , message  :"Something Went Wrong"})
                    }
                    else
                    {
                        if(auth == false)
                        {
                            res.status(400).send({status : 400 , message  :"Incorrect Password"})
     
                        }
                        else
                        {
                                res.status(200).send({ status : 200 ,  message  :"Login Successfully "  , data : {name   : result[0].name  , _id   :result[0]._id  , mobile  : result[0].mobile ,  email   :result[0].email  ,  role : result[0].role }})
    
                        }
                    }
    
                } )
            }



       }
       else
       {
        res.status(400).send({ status:  400, message  :"Your are not a Registered User || Please Register First"})
       }

    }).catch((err)=>{

        res.status(500).send({status : 500 , message  :"Something Went Wrong"})


    })



}


exports.forgot_password  = (req,res)=>{

const {email } = req.body;

let otp   = Math.floor(Math.random() *  456745).toString().padStart(6, 0)


UserSchema.find({email : email}).then((res1)=>{

    if(res1.length  >0)
    {


        OtpSchema.find({u_id : res1[0]._id}).then((find_res)=>{
            if(find_res.length > 0)
            {
             

                OtpSchema.updateOne({u_id : res1[0]._id} , {$set : {otp  : otp ,  time  : Number(new Date()) }}).then((res2)=>{

                    if(res2.modifiedCount == 1)
                    {
        
                        transporter.sendMail({
                            from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                            to: res1[0].email, // list of receivers
                            subject: "Password Reset OTP ✔", // Subject line
                            text: `Hi , ${res1[0].name}`, // plain text body
                            html: `<h1>Please User this OTP : ${otp} to Reset Your Password</h1>`, // html body
                          }).then((mail_result)=>{
                        
                            if(mail_result.messageId){
                        
                                res.status(200).send({status : 200 , message  :"OTP Sent Successfully on your email"})
                            }
                            else
                            {
                                res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                        
                            }
                        
                          }).catch((err)=>{
                            console.log(err)
                            res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                        
                          })
        
        
                    }
                    else
                    {
                        res.status(500).send({status : 500 , message  :"Something Went Wrong"})
          
                    }
        
        
                }).catch((err)=>{
                    res.status(500).send({status : 500 , message  :"Something Went Wrong"})
        
                })


            }
            else{
                OtpSchema.insertMany({u_id : res1[0]._id ,  otp  : otp ,  time  : Number(new Date()) }).then((res2)=>{

            if(res2.length  >0)
            {

                transporter.sendMail({
                    from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                    to: res1[0].email, // list of receivers
                    subject: "Password Reset OTP ✔", // Subject line
                    text: `Hi , ${res1[0].name}`, // plain text body
                    html: `<h1>Please User this OTP : ${otp} to Reset Your Password</h1>`, // html body
                  }).then((mail_result)=>{
                
                    if(mail_result.messageId){
                
                        res.status(200).send({status : 200 , message  :"OTP Sent Successfully on your email"})
                    }
                    else
                    {
                        res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                
                    }
                
                  }).catch((err)=>{
                    console.log(err)
                    res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                
                  })


            }
            else
            {
                res.status(500).send({status : 500 , message  :"Something Went Wrong"})
  
            }


        }).catch((err)=>{
            res.status(500).send({status : 500 , message  :"Something Went Wrong"})

        })
            }
        })


       


    }
    else
    {
        res.status(400).send({ status:  400, message  :"Your are not a Registered User || Please Register First"})

    }

}).catch((err)=>{
    res.status(500).send({status : 500 , message  :"Something Went Wrong"})

})





}


exports.verify_password =  (req,res) =>{

   const  {email, otp  , new_password , confirm_password} = req.body;


   if(!new_password || !confirm_password)
   {
    res.status(400).send({status : 400 , message  :"New Password / Confirm Password Cannot be Empty"})
   }
   else if(new_password != confirm_password)
   {
    res.status(400).send({status : 400 , message  :"New Password Could not match with Confirm Password"})

   }
   else if(!otp)
   {    
    res.status(400).send({status : 400 , message  :"OTP Cannot be Empty"})
   }
   else
   {

 UserSchema.find({email  :email}).then((r1)=>{

    if(r1.length > 0)
    {

            OtpSchema.find({u_id :  r1[0]._id }).then((r2)=>{

                    if(r2.length > 0)
                    {

                        if(otp == r2[0].otp)
                        {

                            if(Number(new Date()) -  r2[0].time > 30000)
                            {
                                res.status(498).send({ status:  498, message  :"OTP Expird"})

                            }
                            else
                            {


                                bcrypt.genSalt( 10,  (err,salt)=>{

                                    if(err)
                                    {
                                        console.log(err)

                                        res.status(500).send({status : 500 , message  :"Something Went Wrong"})

                                    }
                                    else
                                    {
                                        bcrypt.hash(new_password  , salt  , (err  , hash)=>{
                                            if(err)
                                            {
                                                console.log(err)

                                                res.status(500).send({status : 500 , message  :"Something Went Wrong"})
        
                                            }
                                            else{

                                                UserSchema.updateOne({_id :  r1[0]._id} ,  {$set : {password : hash}}).then((r4)=>{
                                                    if(r4.modifiedCount == 1)
                                                    {


                                                        OtpSchema.deleteOne({_id : r2[0]._id }).then((r5)=>{
                                                            if(r5.deletedCount == 1)
                                                            {                                                        
                                                                
                                                                res.status(200).send({status :  200  , message  : "Your Password has reset Successfully"})


                                                            }else
                                                            {
                                                                res.status(200).send({status :  200  , message  : "Your Password has reset Successfully"})

                                                            }
                                                        }).catch((err)=>{
                                                            res.status(500).send({status : 500 , message  :"Something Went Wrong"})

                                                        })


                                                    }
                                                    else
                                                    {
                                                    
                                                        res.status(500).send({status :  500  , message  : "Password Reset Failed"})
                                                    }   


                                                }).catch((err)=>{
                                                    console.log(err)

                                                    res.status(500).send({status : 500 , message  :"Something Went Wrong"})
                                    
                                                })

                                            } 
                                        })
                                    }

                                })


                            }


                        }
                        else
                        {
                            res.status(400).send({ status:  400, message  :"Invalid OTP"})

                        }

                            
                    }else
                    {
                        res.status(400).send({ status:  400, message  :"OTP Verification Failed || Please Try With Resend OTP "})

                    }
            


            }).catch((err)=>{
                console.log(err)

                res.status(500).send({status : 500 , message  :"Something Went Wrong"})

            })


    }
    else
    {
        res.status(400).send({ status:  400, message  :"Your are not a Registered User || Please Register First"})

    }

 }).catch((err)=>{
    console.log(err)
    res.status(500).send({status : 500 , message  :"Something Went Wrong"})

 })

   }




}



exports.resendOtp = (req,res) =>{

const {email } = req.body;


let otp   = Math.floor(Math.random() *  456745).toString().padStart(6, 0)


UserSchema.find({email : email}).then((res1)=>{

    if(res1.length  >0)
    {

        OtpSchema.find({u_id :  res1[0]._id }).then((otp_res)=>{

            if(otp_res.length >  0)
            {


                OtpSchema.updateOne({u_id : res1[0]._id} , {$set : {otp  : otp ,  time  : Number(new Date()) }}).then((res2)=>{

                    if(res2.modifiedCount == 1)
                    {
        
                        transporter.sendMail({
                            from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                            to: res1[0].email, // list of receivers
                            subject: "Password Reset OTP ✔", // Subject line
                            text: `Hi , ${res1[0].name}`, // plain text body
                            html: `<h1>Please User this OTP : ${otp} to Reset Your Password</h1>`, // html body
                          }).then((mail_result)=>{
                        
                            if(mail_result.messageId){
                        
                                res.status(200).send({status : 200 , message  :"OTP Sent Successfully on your email"})
                            }
                            else
                            {
                                res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                        
                            }
                        
                          }).catch((err)=>{
                            console.log(err)
                            res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                        
                          })
        
        
                    }
                    else
                    {
                        res.status(500).send({status : 500 , message  :"Something Went Wrong"})
          
                    }
        
        
                }).catch((err)=>{
                    res.status(500).send({status : 500 , message  :"Something Went Wrong"})
        
                })


            }
            else
            {
                OtpSchema.insertMany({u_id : res1[0]._id ,  otp  : otp ,  time  : Number(new Date()) }).then((res2)=>{

                    if(res2.length  >0)
                    {
        
                        transporter.sendMail({
                            from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                            to: res1[0].email, // list of receivers
                            subject: "Password Reset OTP ✔", // Subject line
                            text: `Hi , ${res1[0].name}`, // plain text body
                            html: `<h1>Please User this OTP : ${otp} to Reset Your Password</h1>`, // html body
                          }).then((mail_result)=>{
                        
                            if(mail_result.messageId){
                        
                                res.status(200).send({status : 200 , message  :"OTP Sent Successfully on your email"})
                            }
                            else
                            {
                                res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                        
                            }
                        
                          }).catch((err)=>{
                            console.log(err)
                            res.status(500).send({status : 400 , message  :"OTP Sent Failed"})
                        
                          })
        
        
                    }
                    else
                    {
                        res.status(500).send({status : 500 , message  :"Something Went Wrong"})
          
                    }
        
        
                }).catch((err)=>{
                    res.status(500).send({status : 500 , message  :"Something Went Wrong"})
        
                })
            }


        }).catch((err)=>{
            res.status(500).send({status : 500 , message  :"Something Went Wrong"})

        })


        


    }
    else
    {
        res.status(400).send({ status:  400, message  :"Your are not a Registered User || Please Register First"})

    }

}).catch((err)=>{
    res.status(500).send({status : 500 , message  :"Something Went Wrong"})

})


}


exports.addToCart = (req,res) =>{

    const {u_id , p_id } = req.body


    CartSchema.insertMany({u_id ,  p_id}).then((result)=>{
        if(result.length  >0 )
        {
            res.status(200).send({status : 200 , message : "Product Added into Cart"})
        }
        else
        {
            res.status(400).send({status : 400 , message : "Product Not Added into Cart"})

        }
    }).catch((err)=>{
        res.status(500).send({status : 500 , message  :"Something Went Wrong"})

    })
    




}


exports.handeQuantity = (req,res) =>{

    const  {cid ,  quantity } =  req.body;


    if(quantity == 0)
    {

        CartSchema.deleteOne({ _id  : cid }).then((result)=>{

            if(result.deletedCount == 1)
            {
                res.status(200).send({status :  200 ,  message  : "Removed Succeessfully"})
            }
            else
            {
                res.status(400).send({status :  400 ,  message  : "Not Removed"})
     
            }
    
        }).catch((err)=>{
            res.status(500).send({status : 500 , message  :"Something Went Wrong"})
    
        })
    }
    else{




    CartSchema.updateOne({ _id  : cid } , {$set: {quantity : quantity}}).then((result)=>{

        if(result.modifiedCount == 1)
        {
            res.status(200).send({status :  200 ,  message  : "Modified Succeessfully"})
        }
        else
        {
            res.status(400).send({status :  400 ,  message  : "Not Modified "})
 
        }

    }).catch((err)=>{
        res.status(500).send({status : 500 , message  :"Something Went Wrong"})

    })


}

    

    
    



}


exports.getCartItemsByUSerId  = (req,res) =>{

    const {u_id} =  req.query;


    CartSchema.find({u_id :  u_id}).then((result)=>{
        res.status(200).send({status : 200 , data :  result ,  count  :result.length})
    }).catch((err)=>{
        res.status(500).send({status : 500 , message  :"Something Went Wrong"})

    })

            


}


exports.getMyOrders = (req,res) =>{

    const {u_id}  = req.query

    OrderSchema.find({ u_id : u_id }).then((result)=>{
    
        res.status(200).send({status :  200 , data  :  result})
    
    }).catch((err)=>{
        res.status(500).send({status :  500 , messgae : "Something Went Wrong"})
    
    })
    
    
    
    }



exports.getCartWithFullDetails=  (req,res) =>{

    const {u_id} =  req.query;


    CartSchema.find({u_id :  u_id}).then( async (result)=>{
        
        for(let i = 0  ; i < result.length ; i++)
        {

        

        let p_data =  await ProductSchema.findOne({_id  :result[i].p_id})
        result[i]._doc['product_data'] =  p_data

        
    }
    
    res.status(200).send({status : 200, data  : result , count  :result.length})



    }).catch((err)=>{
        res.status(500).send({status : 500 , message  :"Something Went Wrong"})

    })



}






exports.getAllProducts = (req,res) =>{


    ProductSchema.find({}).then((result)=>{
        res.status(200).send({status : 200 ,data : result})
    }).catch((err)=>{
        res.status(500).send({ status: 500, message : "Something Went Wrong" })

    })




}

exports.getUserAddresses = (req,res) =>{
    const {u_id } = req.query;

    AddressSchema.find({ u_id  : u_id }).then((result)=>{

        res.status(200).send({status : 200 , data : result})
    }).catch((err)=>{
        res.status(500).send({ status: 500, message : "Something Went Wrong" })

    })



}

exports.addAddress =  (req,res) =>{
    const  {u_id , house_or_flat , street, landmark , pincode ,  country , state, city} =  req.body;


    AddressSchema.insertMany({u_id : u_id ,  house_or_flat : house_or_flat  , street : street  , landmark  :landmark  , pincode   :pincode , country: country , state : state, city : city}).then((result)=>{
        if(result.length  > 0)
        {
            res.status(200).send({ status: 200, message : "Address Added Successfully" })

        }
        else
        {
            res.status(400).send({ status: 400, message : "Address Not Added" })

        }
    }).catch((err)=>{
        res.status(500).send({ status: 500, message : "Something Went Wrong" })

    })
}

exports.purchaseOrder = (req,res)=>{

    const { u_id , order_items , address_id  , total_amount , email , name}  = req.body

    OrderSchema.insertMany({
        order_items : order_items,
        address_id  :address_id,
        total_amount  :total_amount,
        u_id  : u_id
    }).then( async (result)=>{
        if(result.length >  0)
        {

                for(let i = 0 ; i < order_items.length ;  i++)
                {
                    await CartSchema.deleteOne({ _id :  order_items[i]._id})
                }



                
                transporter.sendMail({
                    from: '"Node-JS-PGDAC 👻" <alwaysreadygit@gmail.com>', // sender address
                    to: email, // list of receivers
                    subject: "Order Processed ✔", // Subject line
                    text: `Hi ${name} `, // plain text body
                    html: `<h1>Your Orders has been generate successfully with order id : ${result[0].order_number}</h1>`, // html body
                  }).then((mail_result)=>{
                
                    if(mail_result.messageId){
                
                        res.status(200).send({status : 200 , message  :"Order Processed Successfully"})
                    }
                    else
                    {
                        res.status(500).send({status : 400 , message  :"Order Not Processed || Try Again"})
                
                    }
                
                  }).catch((err)=>{
                    console.log(err)
                    res.status(500).send({status : 400 , message  :"Order Not Processed || Try Again"})
                
                  })


        }
        else
        {
            res.status(400).send({ status: 500, message : "Order Not Processed || Try Again" })
        }
    }).catch((err)=>{
        console.log(err)
        res.status(500).send({ status: 500, message : "Something Went Wrong" })

    })

}



exports.filterOddEven = (req,res ,  next) =>{

    const {number } = req.query;

    if(number % 2 ==  0)
    {
        req.query['status'] =  "even"

        next()
    }
    else
    {
        req.query['status'] =  "odd"

        next()

    }



}


exports.showOddEvenResult = (req,res) =>{

    console.log(req.query)
    if(req.query.status  == "even")
    {
        res.status(200).send(req.query.number + ' is an even number')
    }
    else
    {
        
        res.status(200).send(req.query.number + ' is an odd number')
    }




}


exports.fetchimageData  = (req,res) =>{
    console.log(req.body)
    console.log(req.file)

    
    res.send(`<h1>Your Image has Upload Successfully , You can View Your Imabe by click here</h1><a href='${imageHost + req.file.filename}' >View Image</a>`)
}