const superLogin=require('../model/super_admin_model')
const userModel=require('../model/user_model')
const jwt=require('jsonwebtoken')
const space=require('../model/space_model')

const create =(req,res)=>{
    superLogin.admin.create(req.body,(err,data)=>{
        if(err){throw err}
        else{
            res.status(200).send({message:data})
        }
    })
}

const login=(req,res)=>{
    superLogin.admin.find({username:req.body.username},(err,data)=>{
        if(err){throw err}
        else{
            const token=jwt.sign({id:data[0]._id},"I am admin")
            res.status(200).send({message:data,token})
        }
    })
}

const avaliableWantedList=async(req,res)=>{
    try{
        const data=await space.space.aggregate([{$match:{$and:[{"label":req.params.label},{"deleteFlag":false}]}}])
        if(data.length!=0){
            res.status(200).send({sucess:'true',messsage:'data Fetch successfully',data})
        }else{
            res.status(401).send({succss:'false',message:'Data Not Found'})
        }
    }catch(e){
        res.status(500).send({sucess:'false',messsage:'internal server error'})
    }
}


const createPaymentPackage=(req,res)=>{
    superLogin.package.create(req.body,(err,data)=>{
        if(err){throw err}
        else{
            res.status(200).send({success:'true',message:'created successfully',data})
        }
    })
}

const getPayment=async(req,res)=>{
    const data=await superLogin.package.aggregate([{$match:{"deleteFlag":false}}])
    if(data!=null){
        res.status(200).send({success:'true',message:'fetch data successfully',data})
    }else{
        res.status(401).send({success:'false',message:'Data Not Found'})
    }
}


module.exports={
    create,
    login,
    avaliableWantedList,
    createPaymentPackage,
    getPayment
}
