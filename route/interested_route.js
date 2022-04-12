const router=require('express').Router()
const interest=require('../controller/instereste_controller')

router.post('/create/:spaceId',interest.createInterestedPersons)
router.get('/getInterestedUserBasedSpace/:spaceId',interest.getInterestedUserBasedOnSpace)
router.get('/getSingleInterestedUser',interest.buyersFavoriteList)
router.get('/getSingleUserForSpaceOwner/:spaceId/:userId',interest.getSingleInterestedUserForSpaceOwner)




module.exports=router