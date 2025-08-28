const express=require('express')
const router=express.Router()
var categ=require('../lib/categ')
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
    categ.categ(req,res)
})

router.post('/categ_process',(req,res)=>{
    categ.categ_process(req,res)
})

router.get('/menu/:bigcon',(req,res)=>{
    categ.menu(req,res)
})


        
module.exports = router;