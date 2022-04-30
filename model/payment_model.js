const mongoose=require('mongoose')

const payment=mongoose.Schema({
    orderId:String,
    sixMonthSubcription:String,
    threeMonthSubcription:String,
    oneYearSubcription:String,
    createdAt:{
        type:Date,
        default:Date.now()
    },
    paymentPersonId:String
})


const transcationSchema=mongoose.Schema({
    orderId:String,
    subscriptionPlan:String,
    subscriptionAmount:String,
    createdAt:{
        type:Date,
        default:new Date()
    },
    userId:String,
    subscriptionEndDate:{
        type:String,
        default:'0'
    },
    validityDays:{
        type:String,
        default:'0'
    }

})

const order=mongoose.model('paymentSchema',payment)
const transcation=mongoose.model('transcationSchema',transcationSchema)

module.exports={
    order,transcation
}