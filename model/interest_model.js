const mongoose=require('mongoose')

const interestSchema=mongoose.Schema({
    CreatedAt:{
        type:String,
        default:new Date()
    },
    spaceDetails:{
        type:Object
    },
    customerDetails:{
        type:Object
    },
    interest:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const interested=mongoose.model('interestedSchema',interestSchema)

module.exports={
    interested
}