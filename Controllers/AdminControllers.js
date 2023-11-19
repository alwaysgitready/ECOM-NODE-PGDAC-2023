

const ProductSchema  = require('../Schemas/Products')
const OrderSchema = require('../Schemas/OrderSchema')
const UserSchema  = require('../Schemas/UserSchema')
const AddressSchema  = require('../Schemas/AddressSchema')
const {imageHost } = require('../Config/ImageHost')




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

