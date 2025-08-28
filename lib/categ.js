const { result } = require('lodash')
var db=require('./db')
var sanitizeHtml = require("sanitize-html")
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
module.exports={
    
    categ:(req,res)=>{
        var{loginid,login,name,cls}=authIsOwner(req,res)
        var sql1=`SELECT DISTINCT bigcon, bigname FROM code;`
        var sql2=`SELECT DISTINCT mincon, minname FROM code;`


        db.query(sql1+sql2,(error,result)=>{
            if(error){throw error}

            db.query(`select * from user where loginid=?`,[loginid],(err,results)=>{
                if(err){throw err}
        
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'categ.ejs',
                result:results,
                categ:result[0],
                book:result[1]
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
 },
 categ_process:(req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)
    var post=req.body
    console.log(post)
    var sntzedbigcon=sanitizeHtml(post.categ1)
    var sntzedmincon=sanitizeHtml(post.categ2)

     db.query(`select * from book where bigcon=? and mincon=? order by h desc`,[sntzedbigcon,sntzedmincon],(error,result)=>{
            if(error){throw error}
            if (result.length==0){
                return res.send (`<script>alert("검색결과가 없습니다.")
                    location.href="/categ"
                    </script>`)
            }

            db.query(`select * from user where loginid=?`,[loginid],(err,results)=>{
                if(err){throw err}
        
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'test.ejs',
                result:results,
                categ:result,
                book:result
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })

    })
    
    })



 },
 menu:(req,res)=>{
     var{loginid,login,name,cls}=authIsOwner(req,res)
     var santzedbigcon=sanitizeHtml(req.params.bigcon)
     if(login==false){
           res.send(`<script>alert("로그인이 필요합니다.")
                            location.href="/register/login"
                            </script>`)
        }
    else{
    db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

        db.query(`select * from book where bigcon=? order by h desc`,[santzedbigcon],(err,results)=>{

        console.log(result)
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'test.ejs',
                result:result,
                categ:results,
                book:results
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })


        })
    })
}
 }
}