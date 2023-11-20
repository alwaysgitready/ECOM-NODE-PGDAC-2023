const expres   = require('express');
const router   = expres.Router();
const AdminController  = require('../Controllers/AdminControllers')
const uploadImages   = require('../MiddleWare/uploads')



router.get('/get-all-products'  , AdminController.getAllProducts )
router.post('/add-product', uploadImages, AdminController.addProduct)
router.post('/edit-product', AdminController.editProduct)
router.post('/delete-product', AdminController.deleteProduct)
router.get('/get-dashboard', AdminController.getDashBoardData)
router.get('/get-all-orders', AdminController.getallOrders)
router.get('/get-user-by-id', AdminController.getUserDetailsById)
router.get('/get-address-by-id', AdminController.getDeliveryAddressById)
router.post('/update-product-image', uploadImages ,  AdminController.updateProductImage)
router.post('/add-variation' ,  uploadImages , AdminController.addVariation)
router.get('/get-all-users' ,   AdminController.getAllUsers)
router.post('/set-status' ,   AdminController.ActiveInactive)
router.post('/change-password-by-admin' ,   AdminController.changePasswordByAdmin)
router.post('/gen-jwt' ,  AdminController.gen_Jwt)
router.post('/verify-jwt' ,  AdminController.verify_jwt)




module.exports =  router;