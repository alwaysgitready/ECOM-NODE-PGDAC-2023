const express  = require('express');
const router  =  express.Router()
const Controllers  =  require('../Controllers/UserController')


router.get('/' ,Controllers.CallRootPath)
router.get('/test' , Controllers.callTest )
router.get('/test_odd_even', Controllers.ShowTestResultOddEven )
router.get('/test-form-2' , Controllers.ShowPostForm )
router.post('/test-form-result', Controllers.showPostFormResult)
router.post('/add-user', Controllers.AddUser)
router.post('/login-user', Controllers.userLogin)
router.post('/forgot-password', Controllers.forgot_password)
router.post('/verify-password', Controllers.verify_password)
router.post('/resend-otp', Controllers.resendOtp)
router.post('/add-product', Controllers.addProduct)
router.get('/get-products', Controllers.getAllProducts)
router.post('/add-to-cart', Controllers.addToCart)
router.get('/get-cart-items-by-user-id', Controllers.getCartItemsByUSerId)
router.get('/get-cart-details-with-products', Controllers.getCartWithFullDetails)
router.post('/handleQuantity', Controllers.handeQuantity)
router.get('/get-user-addresses', Controllers.getUserAddresses)
router.post('/add-user-addresses', Controllers.addAddress)
router.post('/purchase_order', Controllers.purchaseOrder)




module.exports = router


