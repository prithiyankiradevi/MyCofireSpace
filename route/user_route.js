const router=require('express').Router()
const userController=require('../controller/user_controller')
const multer=require('../middleware/multer')

router.post('/create',userController.register)
router.post('/login',userController.login)
router.get('/getAll',userController.getAllUser)
router.get('/getById/:userId',userController.getPerUser)
router.put('/update/:userId',userController.updateUser)


router.post('/space/create',userController.createSpace)

router.post('/space/image/create/:id',multer.upload.single('spaceImage'),userController.spaceImage)




module.exports=router