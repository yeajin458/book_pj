// lib/chat.js

const { result, isMatch, stubFalse } = require('lodash')
var db=require('./db')
var sanitizeHtml = require("sanitize-html")
const { resolveObjectURL } = require('buffer')
// const { detail } = require('./board')

function authIsOwner(req,res) {
    var name='Guest'
    var login=false
    var cls='Non'
    var loginid=''
    if(req.session.is_logined){
        name=req.session.name
        login=true
        loginid=req.session.loginid
        cls=req.session.cls
    }
    return{loginid, name,login,cls}
}

module.exports = {
  home: (req, res) => { 
    var{loginid,login,name,cls}=authIsOwner(req,res)
   if(login==false){
           res.send(`<script>alert("로그인이 필요합니다.")
                            location.href="/register/login"
                            </script>`)
        }
        else{
    
    db.query(`select * from user`,(err,results)=>{
        if(err)throw(err)

    db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}
        console.log(result)
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'home.ejs',
                result:result,
                categ:'',
                chat:results,
                target:''
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        }) // 필요한 값만
  })
})
}
  },
room:(req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)
    var id=sanitizeHtml(req.params.id)

    db.query(`select * from user`,(err,results)=>{
        if(err)throw(err)

     db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}
        console.log(result)


        db.query(`select * from user where loginid=?`,[id],(err,results2)=>{
                if(err)throw(err)

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'chat.ejs',
                result:result,
                categ:'',
                chat:results,
                target:results2
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        }) // 필요한 값만
  })
})
    })
}
};
