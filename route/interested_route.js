const router=require('express').Router()
const interest=require('../controller/instereste_controller')

router.post('/create/:userId/:spaceId',interest.createInterestedPersons)
router.get('/getInterestedUserBasedSpace/:spaceId',interest.getInterestedUserBasedOnSpace)
router.get('/getSingleInterestedUser/:userId',interest.getSingleInterestedBuyerDetail)
router.get('/getSingleUserForSpaceOwner/:spaceId/:userId',interest.getSingleInterestedUserForSpaceOwner)




module.exports=router