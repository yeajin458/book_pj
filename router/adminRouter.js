const express=require('express')
const router=express.Router()
var admin=require('../lib/admin')
var book=require('../lib/book')
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
router.get('/person',(req,res)=>{
   admin.person(req,res)
})


router.get('/update',(req,res)=>{
   admin.update(req,res)
})

router.post('/update_process',(req,res)=>{
   admin.update_process(req,res)
})

router.get('/delete_process',(req,res)=>{
   admin.delete_process(req,res)
})
        
router.get('/register',(req,res)=>{
   admin.register(req,res)
})

router.post('/register_process',(req,res)=>{
   admin.register_process(req,res)
})
router.get('/categ',(req,res)=>{
   admin.categ(req,res)
})
router.get('/addcode',(req,res)=>{
   admin.addcode(req,res)
})

router.post('/addcode_process',(req,res)=>{
   admin.addcode_process(req,res)
})
router.get('/updatecode/:bigcon/:mincon',(req,res)=>{
   admin.updatecode(req,res)
})

router.post('/updatecode_process',(req,res)=>{
   admin.updatecode_process(req,res)
})

router.get('/codedelete_process',(req,res)=>{
   admin.codedelete_process(req,res)
})
router.get('/book',(req,res)=>{
   admin.book(req,res)
})



router.get('/updatebook/:bnum',(req,res)=>{
   book.update(req,res)
})

router.post('/updatebook_process',(req,res)=>{
   admin.updatebook_process(req,res)
})

router.get('/bookdelete_process/:bnum',(req,res)=>{
   admin.bookdelete_process(req,res)
})




module.exports = router;