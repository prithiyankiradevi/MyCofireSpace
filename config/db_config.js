const mongoose =require('mongoose')
const urlConfig=require('./url_config')

mongoose.connect(urlConfig.url,{dbName:'myCoFireSpace'},()=>{
    console.log('db connected')
})