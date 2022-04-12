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
    deleteFlag:{
        type:Boolean,
        default:false
    },
    interest:{
        type:Boolean,
        default:false
    }
})

const interested=mongoose.model('interestedSchema',interestSchema)

module.exports={
    interested
}