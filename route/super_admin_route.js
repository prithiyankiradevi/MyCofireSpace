const route=require('express').Router()

const space=require('../controller/user_controller')
const report=require('../controller/report_controller')
const superAdminController=require('../controller/super_admin_controller')

route.post('/create',superAdminController.create)
route.post('/login',superAdminController.login)
route.get('/space/getAll/:label',space.getOverAllSpace)
route.get('/space/getById/:spaceId',space.getBySpaceId)
route.get('/getAllUser',space.getAllUser)

route.get('/getAllReport',report.getAllReport)
route.get('/getSpaceList/:label',superAdminController.avaliableWantedList)

route.post('/create/package',superAdminController.createPaymentPackage)
route.get('/getAllPackage',superAdminController.getPayment)


module.exports=route