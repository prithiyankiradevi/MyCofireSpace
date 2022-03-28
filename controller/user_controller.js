const loginModel=require('../model/user_model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')

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
      console.log(req.body)
        const data=await loginModel.aggregate([{$match:{$and:[{phoneNumber:req.body.phoneNumber},{deleteFlag:false}]}}])
        console.log(data)
        if(data){
          console.log(data)
            const password=await bcrypt.compare(req.body.password,data[0].password)
            if(password==true){
                const token=jwt.sign({name:data[0].username._id},'who are you')
                res.status(200).send({success:'true',message:'successfully login',data:data,role:data[0].role,token})
            }else{
            res.status(200).send({success:'false',message:'invalid password',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'data not exists',data:[]})
        }
    }catch(e){
      console.log(e.message)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const getAllUser=async(req,res)=>{
    try {
        const token = await jwt.decode(req.headers.authorization);
        if (token != undefined) {
          const a = await loginModel.find({deleteFlag:'false'})
          if (a.length != 0) {
            a.sort().reverse()
            res.status(200).send({ success:'true',message:'fetch data successfully',data: a });
          } else {
            res.status(302).send({success:'false',message:'data not found', data: [] });
          }
        } else {
          res.status(400).send({success:'false',message:"UnAuthorized"});
        }
      } catch (e) {
          console.log(e.message)
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

module.exports={
    register,
    login,
    getAllUser,
    getPerUser
}




