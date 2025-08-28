const express=require('express')
const router=express.Router()
var auth=require('../lib/register')
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

router.get('/login',(req,res)=>{
    auth.login(req,res)
});
router.post('/login_process',(req,res)=>{
    auth.login_process(req,res)
})
router.get('/logout',(req,res)=>{
    auth.logout_process(req,res)
})
router.get('/register',(req,res)=>{
    auth.register(req,res)
})
router.post('/register_process',(req,res)=>{
    auth.register_process(req,res)
})
router.get('/profile',(req,res)=>{
    auth.profile(req,res)
})
router.post('/profile_process',(req,res)=>{
    auth.profile_process(req,res)
})
router.post('/upload_process', upload.single('uploadFile'),(req,res)=>{  
    auth.upload_process(req,res)
    
})
router.get('/delete_process',(req,res)=>{
    auth.delete_process(req,res)
})

router.get('/whoiam',(req,res)=>{
    auth.whoiam(req,res)
})
router.post('/whoiam_process',(req,res)=>{
    auth.whoiam_process(req,res)
})
router.get('/passwd',(req,res)=>{
    auth.passwd(req,res)
})
router.post('/passwd_process',(req,res)=>{
    auth.passwd_process(req,res)
})

module.exports = router;