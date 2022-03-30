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
    location:String
})


module.exports=mongoose.model('registerSchema',registerSchema)
