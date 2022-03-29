const router=require('express').Router()
const userController=require('../controller/user_controller')

router.post('/create',userController.register)
router.post('/login',userController.login)
router.get('/getAll',userController.getAllUser)
router.get('/getById/:userId',userController.getPerUser)

router.post('/space/create',userController.createSpace)




module.exports=router