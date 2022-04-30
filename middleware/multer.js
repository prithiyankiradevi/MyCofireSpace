const multer=require('multer')

const storage=multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        console.log(file)
        console.log('jlkikn')
        cb(null,file.originalname)
    }
})

const fileFilters=(req,file,cb,next)=>{
    console.log(file)
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
        console.log(file)
        cb (null,true)
        next
    }else{
        console.log('err')
        cb(null,false)
    }
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}