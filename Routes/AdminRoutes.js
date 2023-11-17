const expres   = require('express');
const router   = expres.Router();
const AdminController  = require('../Controllers/AdminControllers')



router.get('/get-all-products'  , AdminController.getAllProducts )
router.post('/add-product', AdminController.addProduct)
router.post('/edit-product', AdminController.editProduct)
router.post('/delete-product', AdminController.deleteProduct)
router.get('/get-dashboard', AdminController.getDashBoardData)


module.exports =  router;