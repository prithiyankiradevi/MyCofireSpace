const router=require('express').Router()
const userController=require('../controller/user_controller')
const multer=require('../middleware/multer')

router.post('/create',userController.register)
router.post('/login',userController.login)
router.get('/getAll',userController.getAllUser)
router.get('/getById/:userId',userController.getPerUser)
router.put('/update/:userId',userController.updateUser)
router.delete('/delete/:userId',userController.deleteUser)


router.post('/space/create',userController.createSpace)
router.get('/space/getById/:spaceId',userController.getBySpaceId)
router.put('/space/update/:spaceId',userController.updateSpace)
router.get('/space/getAll',userController.getAllSpace)
router.get('/space/getSpaceCreatedByOwner',userController.getAllSpaceCreatedByOwner)
router.get('/space/delete/:spaceId',userController.deleteSpace)

// router.delete('/space/delete',userController.)

router.post('/space/image/create',multer.upload.single('spaceImage'),userController.spaceImage)




module.exports=router