const express=require('express')
const router=express.Router()
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
router.get('/detail/:bnum',(req,res)=>{
    book.detail(req,res)
})
router.get('/create',(req,res)=>{
    book.create(req,res)
})
router.post('/create_process',upload.single('uploadFile'), (req,res)=>{
    book.create_process(req,res)
})
router.get('/update/:bnum',(req,res)=>{
    book.update(req,res)
})
router.post('/update_process',upload.single('uploadFile'),(req,res)=>{
    book.update_process(req,res)
})
router.get('/delete_process/:bnum',(req,res)=>{
    book.delete_process(req,res)
})

router.post('/upload_process', upload.single('uploadFile'),(req,res)=>{  
    book.upload_process(req,res)
    
})
router.post('/:bnum/like',  (req, res) => {
    book.like(req,res)
})


        
module.exports = router;