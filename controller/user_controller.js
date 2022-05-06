var _ = require('lodash');
const mongoose=require('mongoose')
const loginModel=require('../model/user_model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const spaceModel=require('../model/space_model')
const {validationResult}=require('express-validator')
const Razorpay = require('razorpay');
const pagination=require('../middleware/pagination')
const { createCipheriv } = require('crypto')
const nodemailer=require('nodemailer')
const req = require('express/lib/request')
const interest=require('../model/interest_model');
const { listenerCount } = require('process');


let transport = nodemailer.createTransport({
  service: 'gmail',
  auth: {
      user: 'pravindev00@gmail.com',
      pass: 'devpravin00'
  }
})
const postMail = function ( to, subject, text) {
  return transport.sendMail({
      from: 'pravindev00@gmail.com',
      to: to,
      subject: subject,
      text: text
  })
}


const register=async(req,res)=>{
    try{
        const data=await loginModel.aggregate([{$match:{phoneNumber:req.body.phoneNumber}}])
        if(data.length==0){
            req.body.password=await bcrypt.hash(req.body.password,10)
            loginModel.create(req.body,(err,result)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed',data:[]})
                }else{

                  console.log(result)
                  const encryptId=jwt.sign({id:result._id},'who are you')
                  console.log(encryptId)
                    postMail(result.email,'verification',`http://192.168.0.237:7777/user/verification/${encryptId}`)
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


const verifyUsers =async (req,res)=>{

  try{

    const decryptId=await jwt.decode(req.params.id)
    const id=decryptId.id
    const data=await loginModel.findByIdAndUpdate(id,{active:true},{new:true})
    res.status(200).send({message:'verification successfullly'})

  }catch(e){
    res.status(500).send({message:'internal server error'})

  }
}


const login=async(req,res)=>{
    try{
        const data=await loginModel.findOne({phoneNumber:req.body.phoneNumber},{deleteFlag:false})
        // const data=await loginModel.aggregate([{$match:{$and:[{"phoneNumber":req.body.phoneNumber},{"deleteFlag":false}]}},{$match:{"active":true}}])

        // .aggregate([{$match:{"phoneNumber":req.body.phoneNumber}}])
        // .aggregate([{$match:{$and:[{phoneNumber:req.body.phoneNumber},{deleteFlag:'false'}]}}])
        if(data){
            const password=await bcrypt.compare(req.body.password,data.password)
            if(password==true){
                const token=JSON.stringify(jwt.sign({id:data._id},'who are you'))
                
                res.status(200).send({success:'true',message:'successfully login',data:data,token:JSON.parse(token)})
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
          const a = await loginModel.aggregate([{$match:{"deleteFlag":false}}])
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
          let response = await loginModel.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.userId)},{"deleteFlag":false}]}}])
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
        let response = await loginModel.findByIdAndUpdate({_id:req.params.userId},{$set:req.body},{new:true});
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
    res.status(500).send("internal server error")
  }
}

const deleteUser=async(req,res)=>{
  try {
    if (req.params.userId.length == 24) {
      loginModel.findByIdAndUpdate(req.params.userId,{ deleteFlag: "true" },{ returnOriginal: false },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            if (data != null) {
              res.status(200).send({ message: "data deleted successfully" });
            } else {
              res.status(400).send({ data: [] });
            }
          }
        }
      );
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
}

const createSpace=async(req,res)=>{
  try{
    const errors=validationResult(req)
    if(!errors.isEmpty()){
        res.json({message:errors.array()})
    }else{
        if(req.headers.authorization){
            const token=await jwt.decode((req.headers.authorization))
            req.body.spaceOwnerId=token.id
            req.body.label=req.params.label
            spaceModel.space.create(req.body,(err,data)=>{
                if(err){
                    res.status(400).send({success:'false',message:'failed'})
                }else{
                    if(data!=null){
                      console.log(data)
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

const getBySpaceId=async(req,res)=>{
  try{
  if (req.params.spaceId.length == 24) {
    let response = await spaceModel.space.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.spaceId)},{"deleteFlag":false}]}}])
    const data = response[0];
    if (data != null) {
      res.status(200).send({success:'true',message:'data fetch successfully' ,data: data });
    } else {
      res.status(302).send({success:'false',message:'failed', data: [] });
    }
  } else {
    res.status(200).send({ message: "please provide a valid id" });
  }
} catch (e) {
  res.status(500).send("internal server error");
}
}

const getAllSpaceCreatedByOwner=async(req,res)=>{
  try {
    const token = jwt.decode(req.headers.authorization);
    if (token != undefined) {
      const a = await spaceModel.space.aggregate([
        { $match: {spaceOwnerId: token.id} },
      ]);
      const arr=[]
      if (a.length != 0) {
        const filterSpace=a.map((result)=>{
          result.deleteFlag=='false'
          return arr.push(result)
        })
        arr.sort().reverse()
        res.status(200).send({success:'true',message:'fetch all space',data: arr });
      } else {
        res.status(302).send({success:'false',message:'failed',data: [] });
      }
    } else {
      res.status(400).send("UnAuthorized");
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
}

const getOverAllSpace=async(req,res)=>{
  try {
    const token = jwt.decode((req.headers.authorization));
    if (token != undefined) {

      if(req.params.label=='avaliable'){
        var a = await spaceModel.space.aggregate([{$match:{"deleteFlag":false}},{$match:{"label":req.params.label}},{ $sort: { 'rating': -1 }}])    
      }

      if(req.params.label=='wanted'){
        var a = await spaceModel.space.aggregate([{$match:{"deleteFlag":false}},{$match:{"label":req.params.label}},{ $sort: { 'rating': -1 }}])    
      }

      if(req.params.label=='all'){
        var a = await spaceModel.space.aggregate([{$match:{"deleteFlag":false}},{ $sort: { 'rating': -1 }}])
      }
      
      const arr=[]
      if (a.length != 0) {
        const filterSpace=a.map((result)=>{
          result.deleteFlag=='false'
          return arr.push(result)
        })

        const zz = await interest.interested.aggregate([ {$match:{"interest":true}},{ $unwind: { path: "$customerDetails" } },{$match:{"customerDetails._id":new mongoose.Types.ObjectId(token.id)}}])
       const datas=[]
       
       
        for(i=0;i<arr.length;i++){
          arr[i].interestUserList.includes(token.id)?arr[i].interest=true:arr[i].interest=false
          datas.push(arr[i])
        }
      
        res.status(200).send({success:'true',message:'fetch all space',data: result});
      } else {
        res.status(302).send({success:'false',message:'failed',data: [] });
      }
    } else {
      res.status(400).send("UnAuthorized");
    }
  } catch (e) {
    console.log(e)
    res.status(500).send("internal server error");
  }
}

const  updateSpace=async(req,res)=>{
  try{
    if(req.headers.authorization){
      if (req.params.spaceId.length == 24) {
      let response = await spaceModel.space.findByIdAndUpdate(req.params.spaceId,req.body,{new:true})
        if (response) {
          const token=await jwt.decode(req.headers.authorization)
          if(token){
              res.status(200).send({ success:'true',message:'upadate successfully',data: response });
          }else{
            res.status(200).send({ success:'false',message:'invalid token ',data: [] });
          }       
        } else {
          res.status(302).send({ success:'false',data: [] });
        }
      } else {
        res.status(200).send({ message: "please provide a valid space id" });
      }
    }else{
      res.status(400).send({ message: "unauthorized" });
    }
  }catch(e){
    res.status(500).send("internal server error")
  }
}

const spaceImage=async(req,res)=>{

  try{
    console.log('line 304',req.body.spaceImage)
    console.log(req.file)
    req.body.spaceImage=`http://192.168.0.237:7777/uploads/${req.file.originalname}`
    spaceModel.spaceImage.create(req.body,async(err,data)=>{
      if(err){
        res.status(400).send({success:'false',message:'failed'})
      }else{
        console.log(data)
        res.status(200).send({success:'true',message:'space image created successfully',data})
      }
    })
  }catch(e){
    console.log(e)
    res.status(500).send('internal server error')
  }

}

const deleteSpace=async(req,res)=>{
  try {
    if (req.params.spaceId.length == 24) {
      spaceModel.space.findByIdAndUpdate(req.params.spaceId,{ deleteFlag: true },{ new: true },
        (err, data) => {
          if (err) {
            throw err;
          } else {
            if (data != null) {
              res.status(200).send({success:'true', message: "data deleted successfully" });
            } else {
              res.status(400).send({ success:'false',message:'failed', });
            }
          }
        }
      );
    } else {
      res.status(200).send({ message: "please provide a valid id" });
    }
  } catch (e) {
    res.status(500).send("internal server error");
  }
}

const searchAddress=async(req,res)=>{
  const z=await spaceModel.space.aggregate([{$match:{"deleteFlag":false}}])
  const emptyarr = [];
if (z == undefined || null) {
  return;
} else {
  console.log(z.length)
  for (var i = 0; i < z.length; i++) {
   console.log('main')

    if (z[i].address.toLowerCase().includes(req.query.search.toLowerCase())) {
      console.log('firest if')
      emptyarr.push(z[i]);
    } 

    if(z[i].city.toLowerCase().includes(req.query.search.toLowerCase())) {
      console.log('2 if')

      emptyarr.push(z[i]);
    }
    if(z[i].spaceName.toLowerCase().includes(req.query.search.toLowerCase())) {
      console.log('3 if')

      emptyarr.push(z[i]);
    }
  }

  res.status(200).send({data:emptyarr})
}

}

//pending
const avaliableWantedOwnerList=async(req,res)=>{
  try{
    const data=await spaceModel.space.aggregate([{$match:{$and:[{"deleteFlag":false},{"label":req.params.label}]}}])
    const arr=[]
    for(i=0;i<data.length;i++){
      console.log(data[i].spaceOwnerId)
      // const data=await loginModel.findById({_id:data[i].spaceOwnerId})
      // .aggregate([{$match:{"_id":new mongoose.Types.ObjectId(data[i].spaceOwnerId)}}])
      // console.log(data)
      // console.log(data[i].spaceOwnerId)
      // arr.push(data[0])
    }
    console.log(arr)
  }catch(e){

  }
}


module.exports={
    register,
    verifyUsers,
    login,
    getAllUser,
    getPerUser,
    updateUser,
    deleteUser,
    createSpace,
    getBySpaceId,
    getAllSpaceCreatedByOwner,
    getOverAllSpace,
    updateSpace,
    deleteSpace,
    spaceImage,
    searchAddress,
    avaliableWantedOwnerList
}





