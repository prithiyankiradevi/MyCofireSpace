const router=require('express').Router()
const interest=require('../controller/favoritespace_controller')

router.post('/create/:spaceId',interest.createInterestedPersons)
router.get('/getInterestedUserBasedSpace',interest.getAllInterestedUser)
router.get('/getSingleUserForSpaceOwner/:userId',interest.getSingleInterestedUserForSpaceOwner)


module.exports=router