const {body,validationResult}=require('express-validator')
const mongoose = require('mongoose')

const spaceSchema = mongoose.Schema({
    email: String,
    spaceName: String,
    address: String,
    city: String,
    contact: Number,
    day:[],
    dayPrice:String,
    weekPrice:String,
    monthPrice:String,
    wifi: {
        type: Boolean,
        default: false
    },
    food: {
        type: Boolean,
        default: false
    },
    ac: {
        type: Boolean,
        default: false
    },
    meetingRoom: {
        type: Boolean,
        default: false
    },
    spaceImageArray:[String],
    deleteFlag:{
        type:Boolean,
        default:false
    },
    packageStatus:{
        type:String,
        default:'free'
    },
    createdAt:{
        type:Date,
        default:new Date()},
    spaceOwnerId:String,
    rating:{
        type:String,
        default:'0'
    },
    label:String,
    location:{
        spaceLatitude:String,
        spaceLongititude:String
    } ,
    createdAt:{
        type:Date,
        default:new Date()
    },
    category:String
})

const ratingSchema=mongoose.Schema({
    deleteFlag:{
        type:Boolean,
        default:false
    },
    rating:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
})

const spaceImageSchema=mongoose.Schema({
    spaceImage:String,
    deleteFlag:{
        type:Boolean,
        default:false
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
})


const validation = [
    body('email').trim().isEmail().withMessage('email is required'),
    body('contact').isMobilePhone().withMessage('contact is required'),
    body('address').isLength({min:1}).withMessage('address is required'),
    body('spaceName').isAlphanumeric().withMessage('space name is required'),
    body('city').isString().withMessage('city is required')
]


const space=mongoose.model('spaceSchema',spaceSchema)
const spaceImage=mongoose.model('spaceImageSchema',spaceImageSchema)
const rating=mongoose.model('ratingSchema',ratingSchema)


module.exports={
    space,
    spaceImage,
    validation,
    rating
}