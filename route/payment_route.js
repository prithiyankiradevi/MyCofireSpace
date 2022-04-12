const router=require('express').Router()
const paymentController=require('../controller/payment_controller')

router.get('/create',paymentController.createPayment)

module.exports=router
