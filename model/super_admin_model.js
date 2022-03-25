const mongoose=require('mongoose')

const login=mongoose.Schema({
    username:{
        type:String,

    },
    email:String,
    password:String
    
})

module.exports=mongoose.model('superAdmin',login)