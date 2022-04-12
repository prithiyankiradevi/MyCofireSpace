const router=require('express').Router()
const interest=require('../controller/instereste_controller')

router.get('/create/:userId/:spaceId/:interest',interest.createInterestedPersons)
router.get('/getInterestedUserBasedSpace/:spaceId',interest.getInterestedUserBasedOnSpace)
router.get('/getSingleInterestedUser/:userId',interest.buyersFavoriteList)
router.get('/getSingleUserForSpaceOwner/:spaceId/:userId',interest.getSingleInterestedUserForSpaceOwner)




module.exports=router