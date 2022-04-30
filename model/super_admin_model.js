const mongoose=require('mongoose')

const login=mongoose.Schema({
    username:{
        type:String,

    },
    email:String,
    password:String,
    role:{
        type:String,
        default:'admin'
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
    
})


const packageSchema=mongoose.Schema({
    subscriptionPackageName:String,
    subscriptionAmount:Number,
    createdAt:{
        type:Date,
        default:new Date()
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
    
})

const package=mongoose.model('packageSchema',packageSchema)
const admin=mongoose.model('superAdmin',login)


module.exports={
    package,
    admin
}