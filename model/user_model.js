const mongoose=require('mongoose')

const registerSchema = mongoose.Schema({
    username: String,
    email: String,
    phoneNumber:Number,
    password: String,
    deleteFlag: {
        type: Boolean,
        default: false
    },
    location:String,
    paymentStatus:{
        type:String,
        default:'free'
    },
    createdAt:{
        type:Date,
        default:new Date()
    },
    orderId:{
        type:String,
        default:'0'
    },
    subscriptionStartDate:{
        type:String,
        default:'0'
    },
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:Number,
        default:0
    },
    interest:{
        type:Boolean,
        default:false
    },
    active:{
        type:Boolean,
        default:false
    }
})


module.exports=mongoose.model('registerSchema',registerSchema)
