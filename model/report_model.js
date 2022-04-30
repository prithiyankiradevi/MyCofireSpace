const mongoose=require('mongoose')

const reportSchema=mongoose.Schema({
    report:String,
    userName:String,
    spaceName:String,
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const reviewSchema=mongoose.Schema({
    userName:String,
    review:String,
    rating:Number,
    spaceId:String,
    createdAt:{
        type:Date,
        default:new Date()
    },
    deleteFlag:{
        type:Boolean,
        default:false
    }
})

const report=mongoose.model('reportSchema',reportSchema)
const review=mongoose.model('reviewSchema',reviewSchema)

module.exports={
    report,
    review
}