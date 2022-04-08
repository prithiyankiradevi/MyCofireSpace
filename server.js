const express=require('express')
const cors=require('cors')
const dotenv=require('dotenv').config()
require('./config/db_config')
const superAdmin=require('./route/super_admin')
const user=require('./route/user_route')
const space=require('./route/space_route')
const interest=require('./route/interested_route')

const app=express();

app.use(express.json())
app.use(express.urlencoded({extended:true}))
app.use(cors())


app.get('',(req,res)=>{
    res.status(200).send('welcome co fire space')
})

app.use('/admin',superAdmin)
app.use('/user',user)
app.use('/space',space)
app.use('/interest',interest)

app.use('/uploads',express.static('uploads'))

app.listen(process.env.PORT,()=>{
    console.log(`server is listening on the port:${process.env.PORT}`)
})