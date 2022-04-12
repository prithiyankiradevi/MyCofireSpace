const mongoose=require('mongoose')
const loginModel=require('../model/user_model')
const bcrypt=require('bcrypt')
const jwt=require('jsonwebtoken')
const spaceModel=require('../model/space_model')
const {validationResult}=require('express-validator')
const Razorpay = require('razorpay');


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
        const data=await loginModel.findOne({phoneNumber:req.body.phoneNumber},{deleteFlag:false})
        // .aggregate([{$match:{"phoneNumber":req.body.phoneNumber}}])
        // .aggregate([{$match:{$and:[{phoneNumber:req.body.phoneNumber},{deleteFlag:'false'}]}}])
        if(data){
            const password=await bcrypt.compare(req.body.password,data.password)
            if(password==true){
                const token=(jwt.sign({id:data._id},'who are you'))
                res.status(200).send({success:'true',message:'successfully login',data:data,token})
            }else{
            res.status(200).send({success:'false',message:'invalid password',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'data not exists',data:[]})
        }
    }catch(e){
      console.log(e)
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
          console.log(response)
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
    console.log(e.message)
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
            const token=await jwt.decode(req.headers.authorization)
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
    console.log(e.message)
    res.status(500).send('internal server error')
  }
}

const getBySpaceId=async(req,res)=>{
  try{
  if (req.params.spaceId.length == 24) {
    let response = await spaceModel.space.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.spaceId)},{"deleteFlag":false}]}}])
    const data = response[0];
    console.log(data)
    if (data != null) {
      res.status(200).send({success:'true',message:'data fetch successfully' ,data: data });
    } else {
      res.status(302).send({success:'false',message:'failed', data: [] });
    }
  } else {
    res.status(200).send({ message: "please provide a valid id" });
  }
} catch (e) {
  console.log(e.message)
  res.status(500).send("internal server error");
}
}

const getAllSpaceCreatedByOwner=async(req,res)=>{
  console.log(req.body)
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

const getAllSpace=async(req,res)=>{
  try {
    console.log(req.headers.authorization)
    const token = jwt.decode((req.headers.authorization));
    console.log(token)
    if (token != undefined) {
      const a = await spaceModel.space.aggregate([{$match:{"deleteFlag":false}}])    
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
    console.log(e.message)
    res.status(500).send("internal server error");
  }
}

const  updateSpace=async(req,res)=>{
  try{
    if(req.headers.authorization){
      if (req.params.spaceId.length == 24) {
      let response = await spaceModel.space.findByIdAndUpdate(req.params.spaceId,req.body,{new:true})
        console.log(response)
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
    console.log(e.message)
    res.status(500).send("internal server error")
  }
}

const spaceImage=async(req,res)=>{
  try{
    console.log(req.body.spaceImage)
    
// console.log(req.file)
    // req.body.spaceImage=`http://localhost:7777/uploads/${req.file.originalname}`
    spaceModel.spaceImage.create(req.body,async(err,data)=>{
      if(err){
        res.status(400).send({success:'false',message:'failed'})
      }else{
        console.log(data)
      //   const z=await spaceModel.space.findById(req.params.id)
      //  z.spaceImageArray.push(data.spaceImage)
      //  const a=await spaceModel.space.findByIdAndUpdate(req.params.id,z,{new:true})
        res.status(200).send({success:'true',message:'space image created successfully',data})
      }
    })
  }catch(e){
    console.log(e.message)
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
              console.log(data)
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
    console.log(e.message)
    res.status(500).send("internal server error");
  }
}





module.exports={
    register,
    login,
    getAllUser,
    getPerUser,
    updateUser,
    deleteUser,
    createSpace,
    getBySpaceId,
    getAllSpaceCreatedByOwner,
    getAllSpace,
    updateSpace,
    deleteSpace,
    spaceImage,
}





