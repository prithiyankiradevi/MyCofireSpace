const router=require('express').Router()
const spaceController=require('../controller/space_controller')
const valid=require('../model/space_model')

router.post('/create',valid.validation,spaceController.createSpace)

module.exports=router