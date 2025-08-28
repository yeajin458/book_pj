const express=require('express')
const router=express.Router()
var root=require('../lib/root')
const multer=require('multer')
const upload=multer({
    storage: multer.diskStorage({
        destination: function(req,file,cb){cb(null,'public/images') },
        filename:function(req,file,cb){
            var newFileName=Buffer.from(file.originalname,"latin1").toString("utf-8")
                cb(null,newFileName);
        }
    })

})

//var topic=require('../lib/topic')//작업 폴더로 이동
router.get('/',(req,res)=>{
    root.home(req,res)
})
router.post('/search',(req,res)=>{
    root.search(req,res)
})
router.get('/view',(req,res)=>{
    root.view(req,res)
})




        
module.exports = router;