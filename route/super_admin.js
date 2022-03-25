const router=require('express').Router()
// const loginController=require('../controller/login_controller')
const superController=require('../controller/super_admin_controller')

router.post('/create',superController.create)
router.post('/login',superController.login)
router.get('/getBuyerList',superController.getBuyerFromUser)
router.get('/getSellerList',superController.getSellerFromUser)


module.exports=router