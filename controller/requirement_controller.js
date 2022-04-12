const requirementModel=require('../model/requirement_model')
const {validationResult}=require('express-validator')

const createRequirement=(req,res)=>{
    try{
        const errors=validationResult(req)
        if(!errors.isEmpty()){
            res.json({message:errors.array()})
        }else{
            if(req.headers.authorization){
                const token=await jwt.decode(req.headers.authorization)
                req.body.requirementUser=token.id
                requirementModel.requirement.create(req.body,(err,data)=>{
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

const getAllRequirement=(req,res)=>{
    try{
        const a = await requirementModel.requirement.aggregate([{$match:{"deleteFlag":false}}])
          if (a.length != 0) {
            a.sort().reverse()
            res.status(200).send({ success:'true',message:'fetch data successfully',data: a });
          } else {
            res.status(302).send({success:'false',message:'data not found', data: [] });
          }
    }catch(e){
        res.status(500).send({message:'internal server error'});
    }
}

const getSingleRequirement=(req,res)=>{
    try {
        if (req.params.userId.length == 24) {
          let response = await requirementModel.requirement.aggregate([{$match:{$and:[{"_id":new mongoose.Types.ObjectId(req.params.userId)},{"deleteFlag":false}]}}])
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

const deletRequirement=(req,res)=>{
    try {
        if (req.params.userId.length == 24) {
          requirementModel.requirement.findByIdAndUpdate(req.params.userId,{ deleteFlag: "true" },{ returnOriginal: false },
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

module.exports={
    createRequirement,
    getAllRequirement,
    getSingleRequirement,
    deletRequirement    
}