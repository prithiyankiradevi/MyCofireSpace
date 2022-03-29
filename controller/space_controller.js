const spaceModel=require('../model/space_model')
const userModel=require('../model/user_model')
const {validationResult}=require('express-validator')
const jwt=require('jsonwebtoken')
const { JsonWebTokenError } = require('jsonwebtoken')


const createSpace=async(req,res)=>{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.json({message:errors.array()})
    }else{
        if(req.headers.authorization){
            const token=await jwt.decode(req.headers.authorization)
            req.body.spaceOwnerName=token.name
            req.body.spaceOwnerId=token.id
            spaceModel.space.create(req.body,(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed'})
                }else{
                    if(data!=null){
                        res.status(200).send({success:'true',message:'create successfully',data})
                    }else{
                        res.status(200).send({success:'false',message:'failed',data:[]})
                    }
                }
            })
        }else{
            res.status(200).send({success:'false',message:'unauthorized'})
        }
    }
}

module.exports={
    createSpace
}

