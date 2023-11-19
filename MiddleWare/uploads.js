const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/PGDAC-23-Project/Backend/uploads')
    },
    filename: function (req, file, cb) {
        const x   = file.originalname.split('.')
        const file_name = x[0]
        const ext  = "." + x[x.length  - 1]

      cb(null, file_name + "_" + Number(Date.now()).toString() + ext)
    }
  })
  
  const upload = multer({ storage: storage, 
    fileFilter : function(req , file , callback){

        const x   = file.originalname.split('.')
        const ext  = "." + x[x.length  - 1]

        let avl_ext  =  ['.png' , 'jpg' , '.jpeg' , '.JPG' , '.JPEG']

        if(! avl_ext.includes(ext) )
        {

            return callback(new Error(`Only ${avl_ext.toString()} extensions are Allowe `))
        }

        callback(null , true)


    }

})


const uploadFiles=  upload.single('img')


const uploadImages =  (req,res, next) =>{
    
    uploadFiles(req, res, err => {

        if(err)
        {
            return res.status(400).send({status : 400 , message : err.message})
        }

        if(!req.file)
        {
            return res.status(400).send({status : 400 , message : "Please Upload At Least One Image"})

        }

        next()

    })

}


  module.exports  = uploadImages