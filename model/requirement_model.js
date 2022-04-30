const mongoose=require('mongoose')
const {body}=require('express-validator')
const requirementSchema=mongoose.Schema({
    contact:Number,
    aboutPlace:String,
    requirementUser:String,
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:new Date()
    }
})

const validation=[
    body('contact').isMobilePhone().withMessage('contact is required')
]
const requirement=mongoose.model('requirementSchema',requirementSchema)

module.exports={
    validation,
    requirement
}
