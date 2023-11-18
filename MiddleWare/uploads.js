const multer  = require('multer')


const storage = multer.diskStorage({
    destination: function (req, file, cb) {
      cb(null, '/PGDAC-23-Project/Backend/uploads')
    },
    filename: function (req, file, cb) {
    const x   = file.originalname.split('.')
    const ext  = x[x.length  - 1]

      cb(null, file.originalname)
    }
  })
  
  const upload = multer({ storage: storage })


  module.exports  = upload