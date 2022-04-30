const router=require('express').Router()
const paymentController=require('../controller/payment_controller')

router.get('/createOrderId',paymentController.createOrderId)
router.post('/createPaymentDetails/:userId',paymentController.createPaymentDetails)


module.exports=router
