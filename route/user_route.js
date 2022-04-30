const router=require('express').Router()
const userController=require('../controller/user_controller')
const multer=require('../middleware/multer')
const admin=require('../controller/super_admin_controller')


router.post('/create',userController.register)
router.post('/login',userController.login)
router.get('/getAll',userController.getAllUser)
router.get('/getById/:userId',userController.getPerUser)
router.put('/update/:userId',userController.updateUser)
router.delete('/delete/:userId',userController.deleteUser)

router.post('/space/create/:label',userController.createSpace)
router.get('/space/getById/:spaceId',userController.getBySpaceId)
router.put('/space/update/:spaceId',userController.updateSpace)
router.get('/space/getAll/:label',userController.getOverAllSpace)
router.get('/space/getSpaceCreatedByOwner',userController.getAllSpaceCreatedByOwner)
router.delete('/space/delete/:spaceId',userController.deleteSpace)

router.get('/getAllPackages',admin.getPayment)

router.post('/space/image/create',multer.upload.single('spaceImage'),userController.spaceImage)

router.get('/searchSpaceAddress',userController.searchAddress)
router.get('/getSpaceList/:label',userController.avaliableWantedOwnerList)




module.exports=router