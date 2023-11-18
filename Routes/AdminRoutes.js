const expres   = require('express');
const router   = expres.Router();
const AdminController  = require('../Controllers/AdminControllers')



router.get('/get-all-products'  , AdminController.getAllProducts )
router.post('/add-product', AdminController.addProduct)
router.post('/edit-product', AdminController.editProduct)
router.post('/delete-product', AdminController.deleteProduct)
router.get('/get-dashboard', AdminController.getDashBoardData)
router.get('/get-all-orders', AdminController.getallOrders)
router.get('/get-user-by-id', AdminController.getUserDetailsById)
router.get('/get-address-by-id', AdminController.getDeliveryAddressById)


module.exports =  router;