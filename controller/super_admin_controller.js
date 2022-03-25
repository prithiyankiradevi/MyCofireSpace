const superLogin=require('../model/super_admin_model')
const BuyerSeller=require('../model/user_model')
const create =(req,res)=>{
    console.log(req.body)
    superLogin.create(req.body,(err,data)=>{
        if(err){throw err}
        else{
            res.status(200).send({message:data})
        }
    })
}

const login=(req,res)=>{
    superLogin.find({username:req.body.username},(err,data)=>{
        if(err){throw err}
        else{
            res.status(200).send({message:data})
        }
    })
}


const getBuyerFromUser=(req,res)=>{
    console.log('data')
    
    BuyerSeller.find({role:'buyer'},(err,data)=>{

        if(err){throw err}
        else{
            console.log(data)
            res.status(200).send({data:data})
        }
    })
}

const getSellerFromUser=(req,res)=>{
    BuyerSeller.find({role:'seller'},(err,data)=>{
        if(err){throw err}
        else{
            res.status(200).send({data:data})
        }
    })
}


module.exports={
    create,
    login,
    getBuyerFromUser,
    getSellerFromUser
}
