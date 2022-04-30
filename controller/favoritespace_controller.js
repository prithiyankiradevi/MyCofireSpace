const userModel=require('../model/user_model')
const spaceModel=require('../model/space_model')
const interested=require('../model/interest_model')
const { default: mongoose } = require('mongoose')
const jwt=require('jsonwebtoken')
const payment=require('../model/payment_model')
const razorPay=require('razorpay')
var moment = require('moment')

const createInterestedPersons=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
                const user=await interested.interested.aggregate([{$unwind:{path:"$spaceDetails"}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{"spaceDetails._id":new mongoose.Types.ObjectId(req.params.spaceId)},{"customerDetails._id":new mongoose.Types.ObjectId(token.id)}]}}])
                if(user.length==0){

                    if(req.body.interest==true){

                        const user=await userModel.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(token.id)}},{$match:{"deleteFlag":false}}])
                        req.body.customerDetails=user[0]

                        const space=await spaceModel.space.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(req.params.spaceId)}},{$match:{"deleteFlag":false}}])       
                        req.body.spaceDetails=space[0]

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

const getAllInterestedUser=async(req,res)=>{

   try{
        if(req.headers.authorization){
        const token=jwt.decode(req.headers.authorization)

        if(token){
        const data=await userModel.aggregate([{$match:{"_id":new mongoose.Types.ObjectId(token.id)}}])
        console.log(data)
        if(data[0].paymentStatus=='paid'){
            const data1=await payment.transcation.aggregate([{$match:{"orderId":data[0].orderId}}])
            if(data1.length!=0){
                if(data[0].subscriptionEndDate > moment(new Date()).toISOString()){

                    const data=await interested.interested.aggregate([{$match:{"interest":true}},{$unwind:{path:"$spaceDetails"}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{'spaceDetails.spaceOwnerId':(token.id)},{"spaceDetails.deleteFlag":false}]}}]) 
                    console.log(data.length)
    
                 res.status(200).send({success:'true',message:'fetch data successfully',data})
                }
                else{
    
                    const data=await interested.interested.aggregate([{$match:{"interest":true}},{$unwind:{path:"$spaceDetails"}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{'spaceDetails.spaceOwnerId':(token.id)},{"spaceDetails.deleteFlag":false}]}},{$match:{"customerDetails.deleteFlag":false}},{$limit:2}])
    
                    res.status(200).send({success:'true',message:'subscription package was expired',data})  
                }
            }
            else{
                res.status(401).send({success:'false',message:'Does not track your order id'})  

            }
           
        }else{
            const data=await interested.interested.aggregate([{$match:{"interest":true}},{$unwind:{path:"$spaceDetails"}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{'spaceDetails.spaceOwnerId':(token.id)},{"spaceDetails.deleteFlag":false}]}},{$match:{"customerDetails.deleteFlag":false}},{$limit:2}])

            res.status(200).send({success:'true',message:'fetch data successfully',data})
        }
    
            }else{
                 res.status(400).send({success:'false',message:'invalid token'})
            }

        }else{
            res.status(400).send({success:'false',message:'unauthorized'})
        }

    }catch(e){
        console.log('line 49',e)
        res.status(500).send({message:'internal server error'})
    }
}

const getSingleInterestedUserForSpaceOwner=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            if(token){
                if(req.params.userId){

                    const data=await interested.interested.aggregate([{$match:{"interest":true}},{$match:{"customerDetails.deleteFlag":false}},{$unwind:{path:"$customerDetails"}},{$match:{$and:[{"customerDetails._id":new mongoose.Types.ObjectId(req.params.userId)},{"customerDetails.deleteFlag":false}]}},{$project:{customerDetails:1}}])
                    
                    res.status(200).send({success:'true',message:'fetch data successfully',data})

                }else{
                    res.status(401).send({success:'false',message:'params is required',data:[]})
                }
            }else{
                res.status(400).send({success:'false',message:'invalid token',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized',data:[]})
        }
        
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}


module.exports={
    createInterestedPersons,
    getAllInterestedUser,
    getSingleInterestedUserForSpaceOwner
}