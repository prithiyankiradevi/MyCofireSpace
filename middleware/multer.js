const multer=require('multer')

const storage=multer.diskStorage({
    destination:'uploads',
    filename:(req,file,cb)=>{
        cb(null,file.originalname)
    }
})

const fileFilters=(req,file,cb,next)=>{
    if(file.mimetype=='image/png'||file.mimetype=='image/jpg'||file.mimetype=='image/jpeg'){
        cb (null,true)
        next
    }else{
        cb(null,false)
    }
}

const upload=multer({storage:storage,fileFilter:fileFilters})

module.exports={upload}