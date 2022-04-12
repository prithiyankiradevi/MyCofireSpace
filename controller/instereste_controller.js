const userModel=require('../model/user_model')
const spaceModel=require('../model/space_model')
const interested=require('../model/interest_model')
const { default: mongoose } = require('mongoose')
const jwt=require('jsonwebtoken')
const razorPay=require('razorpay')

const createInterestedPersons=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            const user=await interested.interested.aggregate([{$unwind:{path:"$spaceDetails"}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{"spaceDetails._id":new mongoose.Types.ObjectId(req.params.spaceId)},{"customerDetails._id":new mongoose.Types.ObjectId(token.id)}]}}])
            if(user.length==0){
                if(req.body.interest=='true'){
                    const user=await userModel.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(token.id)}},{$match:{"deleteFlag":false}}])
                    req.body.customerDetails=user
                    const space=await spaceModel.space.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.spaceId)}},{$match:{"deleteFlag":false}}])       
                    req.body.spaceDetails=space
                    interested.interested.create(req.body,(err,data)=>{
                    if(err){throw err}
                    else{
                        res.status(200).send({success:'true',message:'created successfully',data})
                    }
                })
                }
            }else{
                const data=await interested.interested.findByIdAndUpdate({_id:user[0]._id},req.body,{new:true})
                res.status(200).send({success:'true',message:'unliked successfully',data})
            }
        }else{
            res.status(200).send({success:'false',message:'unauthorized',data})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }
}

const getInterestedUserBasedOnSpace=async(req,res)=>{
    try{
        if(req.params.spaceId){
            const data=await interested.interested.aggregate([{$unwind: { path: "$spaceDetails" }},{$match:{'spaceDetails._id':new mongoose.Types.ObjectId(req.params.spaceId)}}])
            res.status(200).send({success:'true',message:'fetch data successfully',data})
        }else{
            res.status(401).send({success:'false',message:'params is required',data:[]})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({message:'internal server error'})
    }
}

const buyersFavoriteList=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            const data=await interested.interested.aggregate([{$unwind:{path:"$customerDetails"}},{$match:{$and:[{"customerDetails._id":new mongoose.Types.ObjectId(token.id)},{"deleteFlag":false}]}}])
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



module.exports={
    createInterestedPersons,
    getInterestedUserBasedOnSpace,
    buyersFavoriteList,
    getSingleInterestedUserForSpaceOwner
}
