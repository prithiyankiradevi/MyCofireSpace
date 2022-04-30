const jwt=require('jsonwebtoken')
const reportSchema=require('../model/report_model')
const space=require('../model/space_model')

const createReport=async(req,res)=>{
    try{
        if(req.headers.authorization){
                await reportSchema.report.create(req.body,(err,result)=>{
                    console.log(result)
                    if(err){throw err}
                    else{
                        res.status(200).send({success:'true',message:'Report Posted Successfully',result})
                    }
                })
            
        }else{
            res.status(400).send({success:'false',message:'unauthorized',data:[]})
        }
    }catch(e){
        res.status(500).send({message:'internal server error'})
    }
}

const getAllReport=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const data=await reportSchema.report.aggregate([{$match:{"deleteFlag":false}}])
            if(data.length!=0){
                res.status(200).send({success:'true',message:'Data Fetch Sucessfully',data})
            }else{
                res.status(400).send({success:'false',message:'Data Not Found',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized',data:[]})
        }
    }catch(e){
        res.status(500).send({message:'Data Fetch Sucessfully'})
    }
}

// const deleteReport=async(req,res)=>{
//     try{
//         if(req.headers.authorization){
            
//         const data=await reportSchema.report.findByIdAndUpdate(req.params.reportId,{deleteFlag:true},{new:true})
//             if(data.length==null){
//                 res.status(200).send({success:'true',message:'Data Delete Sucessfully'})
//             }else{
//                 res.status(400).send({success:'false',message:'Failed'})
//             }
//         }else{
//             res.status(400).send({success:'false',message:'unauthorized',data:[]})
//         }
//     }catch(e){
//         console.log(e.message)
//         res.status(500).send({message:'internal server error'})
//     }
// }


const createReview=(req,res)=>{
    try{
        if(req.headers.authorization){

            const token=jwt.decode((req.headers.authorization))
            if(token){
                req.body.spaceId=req.params.spaceId
                reportSchema.review.create(req.body,async(err,result)=>{
                    if(err){throw err}
                    else{

                        const data=await reportSchema.review.aggregate([{$match:{"deleteFlag":false}}])
                        // console.log('line 72',data.length)
                        if(data!=null){
                            let a=0
                            for(i=0;i<data.length;i++){
                                 a+=parseInt(data[i].rating )
                            }
                            // console.log(a)
                            const averageRating=a/data.length
                            req.body.rating=averageRating

                            const data1=await space.space.findByIdAndUpdate(req.params.spaceId,req.body,{new:true})
                                // console.log(data1)
                            res.status(200).send({success:'true',message:'posted your review',data:result})

                        }else{
                        res.status(401).send({success:'false',message:'Data Not Found'})
                        }
                        
                    }
                })
            }else{
                res.status(400).send({success:'false',message:'invalid token',data:[]})
            }
        }else{
            res.status(400).send({success:'false',message:'unauthorized',data:[]})
        }
    }catch(e){
        console.log(e.message)
        res.status(500).send({success:'false',message:'internal server error'})
    }
}

const getAllReviewForSpace=async(req,res)=>{
    try{
        if(req.headers.authorization){
            const token=jwt.decode(req.headers.authorization)
            if(token){
               const data=await reportSchema.review.aggregate([{$match:{$and:[{"spaceId":req.params.spaceId},{"deleteFlag":false}]}}])
               console.log(data)
               res.status(200).send({success:'true',message:'Data Fetch Successfully',data})
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

// const deleteReview=(req,res)=>{
//     try{
//         if(req.params.reviewId){
//             const data=reportSchema.review.findByIdAndUpdate(req.params.reviewId,{deleteFlag:true},{new:true})
//             if(data.deleteFlag==true){
//                 res.status(200).send({success:'true',message:'deleted Successfully'})
//             }else{
//                 res.status(400).send({success:'false',message:'failed'})
//             }
//         }else{
//             res.status(400).send({success:'false',message:'invalid id'})
//         }
//     }catch(e){
//         res.status(500).send({message:'internal server error'})
//     }
// }


module.exports={
    createReport,
    getAllReport,
    // deleteReport,
    createReview,
    getAllReviewForSpace
}