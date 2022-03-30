const loginModel=require('../model/user_model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const spaceModel=require('../model/space_model')
const {validationResult}=require('express-validator')

const register=async(req,res)=>{
    try{
        const data=await loginModel.aggregate([{$match:{phoneNumber:req.body.phoneNumber}}])
        if(data.length==0){
            req.body.password=await bcrypt.hash(req.body.password,10)
            loginModel.create(req.body,(err,result)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed',data:[]})
                }else{
                    res.status(200).send({success:'true',message:'successfully created',data:result})
                }
            })
        }else{
            res.status(400).send({success:'false',message:'phonenumber already exists,please try another'})
        }
    }catch(e){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const login=async(req,res)=>{
    try{
        const data=await loginModel.aggregate([{$match:{$and:[{phoneNumber:req.body.phoneNumber},{deleteFlag:false}]}}])
        if(data){
            const password=await bcrypt.compare(req.body.password,data[0].password)
            if(password==true){
                const token=jwt.sign({id:data[0]._id},'who are you')
                res.status(200).send({success:'true',message:'successfully login',data:data,token})
            }else{
            res.status(200).send({success:'false',message:'invalid password',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'data not exists',data:[]})
        }
    }catch(e){
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const getAllUser=async(req,res)=>{
    try {
          const a = await loginModel.find({deleteFlag:'false'})
          if (a.length != 0) {
            a.sort().reverse()
            res.status(200).send({ success:'true',message:'fetch data successfully',data: a });
          } else {
            res.status(302).send({success:'false',message:'data not found', data: [] });
          }
      } catch (e) {
        res.status(500).send({message:"internal server error"});
      }
}

const getPerUser=async(req,res)=>{
    try {
        if (req.params.userId.length == 24) {
          let response = await loginModel.find({_id:req.params.userId,deleteFlag:"false"});
          const data = response[0];
          if (data != null) {
            res.status(200).send({ success:'true',message:'fetch data successfully',data: data });
          } else {
            res.status(302).send({ success:'false',data: [] });
          }
        } else {
          res.status(200).send({ message: "please provide a valid id" });
        }
      } catch (e) {
        res.status(500).send("internal server error");
      }
}

const updateUser=async(req,res)=>{
  try{
    if(req.headers.authorization){
      if (req.params.userId.length == 24) {
        let response = await loginModel.findByIdAndUpdate({_id:req.params.userId,deleteFlag:"false"},{$set:req.body},{new:true});
        // const data = response[0];
        if (response) {
          res.status(200).send({ success:'true',message:'fetch data successfully',data: response });
        } else {
          res.status(302).send({ success:'false',data: [] });
        }
      } else {
        res.status(200).send({ message: "please provide a valid id" });
      }
    }else{
      res.status(400).send({ message: "unauthorized" });
    }
  }catch(e){
    console.log(e.message)
    res.status(500).send("internal server error")
  }
}

const createSpace=async(req,res)=>{
  try{
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
  }catch(e){
    res.status(500).send('internal server error')
  }
}

const spaceImage=async(req,res)=>{
  req.body.spaceImage=`https://mycofirespace.herokuapp.com/uploads/${req.file.originalname}`
  spaceModel.spaceImage.create(req.body,async(err,data)=>{
    if(err){
      res.status(400).send({success:'false',message:'failed'})
    }else{
    //   const z=await spaceModel.space.findById(req.params.id)
    //  z.spaceImageArray.push(data.spaceImage)
    //  const a=await spaceModel.space.findByIdAndUpdate(req.params.id,z,{new:true})
      res.status(200).send({success:'true',message:'space image created successfully',data})
    }
  })
}

module.exports={
    register,
    login,
    getAllUser,
    getPerUser,
    updateUser,
    createSpace,
    spaceImage
}




