const userModel=require('../model/user_model')
const spaceModel=require('../model/space_model')
const interested=require('../model/interest_model')
const { default: mongoose } = require('mongoose')
const razorPay=require('razorpay')

const createInterestedPersons=async(req,res)=>{
    try{
        const user=await userModel.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.userId)}},{$match:{"deleteFlag":false}}])
        req.body.customerDetails=user
        const space=await spaceModel.space.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.spaceId)}},{$match:{"deleteFlag":false}}])       
        req.body.spaceDetails=space
        interested.interested.create(req.body,(err,data)=>{
            if(err){throw err}
            else{
                res.status(200).send({success:'true',message:'created successfully',data})
            }
        })
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}

const getInterestedUserBasedOnSpace=async(req,res)=>{
    try{
        if(req.params.spaceId){
            const data=await interested.interested.aggregate([{$unwind: { path: "$spaceDetails" }},{$match:{$and:[{'spaceDetails._id':new mongoose.Types.ObjectId(req.params.spaceId)},{'deleteFlag':false}]}}])
            res.status(200).send({success:'true',message:'fetch data successfully',data})
        }else{
            res.status(401).send({success:'false',message:'params is required',data:[]})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }
}

const getSingleInterestedBuyerDetail=async(req,res)=>{
    try{
        if(req.params.userId){
            const data=await interested.interested.aggregate([{$unwind:{path:"$customerDetails"}},{$match:{$and:[{"customerDetails._id":new mongoose.Types.ObjectId(req.params.userId)},{"deleteFlag":false}]}}])
            res.status(200).send({success:'true',message:'fetch data successfully',data})
        }else{
            res.status(401).send({success:'false',message:'params is required',data:[]})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }    
}

const getSingleInterestedUserForSpaceOwner=async(req,res)=>{
    try{
        if(req.params.spaceId && req.params.userId){
            const data=await interested.interested.aggregate([{$unwind:{path:"$spaceDetails"}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{"spaceDetails._id":new mongoose.Types.ObjectId(req.params.spaceId)},{"customerDetails._id":new mongoose.Types.ObjectId(req.params.userId)}]}},{$match:{"deleteFlag":false}}])
            res.status(200).send({success:'true',message:'fetch data successfully',data})
        }else{
            res.status(401).send({success:'false',message:'params is required',data:[]})
        }
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}

const payment=(req,res)=>{
    rzp_test_UQ1rJWCng78O7O
    ERxY8KnHwIcjgWb5znZSmpLr    
}


module.exports={
    createInterestedPersons,
    getInterestedUserBasedOnSpace,
    getSingleInterestedBuyerDetail,
    getSingleInterestedUserForSpaceOwner
}
