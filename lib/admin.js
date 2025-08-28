const { result, isMatch } = require('lodash')
var db=require('./db')
var sanitizeHtml = require("sanitize-html")
const { update_process, delete_process } = require('./book')
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
    
 person:(req,res)=>{
        var{loginid,login,name,cls}=authIsOwner(req,res)

        db.query( `select * from user`,(error,results)=>{
            if(error){throw error}
            db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'ADperson.ejs',
                result:result,
                categ:'',
                book:'',
                list:results,
                cu:''
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
 },
  update:(req,res)=>{
        var{loginid,login,name,cls}=authIsOwner(req,res)
        var id=req.query.id

        db.query( `select * from user where loginid=? `,[id],(error,result)=>{
            if(error){throw error}
            db.query( `select * from user where loginid=?;` ,[loginid],(error1,results)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'profile.ejs',
                result:results,
                categ:'UP',
                book:'',
                list:result,
                cu:''
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
 },
 update_process:(req,res)=>{
      var post=req.body
      var sntzedloginid = sanitizeHtml(post.loginid); 
      var sntzedName = sanitizeHtml(post.name); 
      var sntzedAddress=sanitizeHtml(post.address)
      var sntzedtel=sanitizeHtml(post.tel)
      var sntzedbirth=sanitizeHtml(post.birth)
      var sntzedclass=sanitizeHtml(post.class)
          
    
        db.query(`UPDATE user set name=?, birth=?, tel=?, address=?, class=? where loginid=?`,
            [sntzedName, sntzedbirth, sntzedtel, sntzedAddress, sntzedclass, sntzedloginid],(err,result)=>{
                    if(err){throw err}
                    
                    res.redirect('/admin/person')
                   
                })
            },
delete_process:(req,res)=>{
    var id=req.query.id

        db.query(`delete from user where loginid=?`,[id],(err,result)=>{
                    if(err){throw err}
                    
                    res.redirect('/admin/person')
                   
                })
},
register:(req,res)=>{

 var{loginid,login,name,cls}=authIsOwner(req,res)

    db.query( `select * from user where loginid=?;` ,[loginid],(error1,results)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'register.ejs',
                result:results,
                categ:'',
                book:'',
                list:'',
                cu:''
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
 },
 categ:(req,res)=>{
     var{loginid,login,name,cls}=authIsOwner(req,res)

        db.query( `select * from code`,(error,results)=>{
            if(error){throw error}
            db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'ADcateg.ejs',
                result:result,
                categ:'',
                book:'',
                list:results,
                cu:''
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
 },
 addcode:(req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)
    db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'newcode.ejs',
                result:result,
                categ:'',
                book:'',
                list:'',
                cu:'c'
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
 },
 addcode_process:(req,res)=>{
    var post=req.body
    console.log(post)
    var sntzedbigcon=sanitizeHtml(post.bigcon)
    var sntzedbigname=sanitizeHtml(post.bigname)
    var sntzedmincon=sanitizeHtml(post.mincon)
    var sntzedminname=sanitizeHtml(post.minname)

    db.query(`insert into code values(?,?,?,?)`,[sntzedbigcon,sntzedbigname,sntzedmincon,sntzedminname],(err,result)=>{
        if(err){
            console.log(err)
            res.send( `<script>alert("코드가 잘못 입력되었습니다. 코드를 다시 확인해주세요. ")
            location.href="/admin/categ"
            </script>`)
        return;
        
        }
        res.redirect('/admin/categ')
    })

 },
 updatecode:(req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)


    var sntzedbig=sanitizeHtml(req.params.bigcon)
    var sntzedmin=sanitizeHtml(req.params.mincon)

    db.query(`select * from code where bigcon=? and  mincon=?`,[sntzedbig,sntzedmin],(err,results)=>{
        if(err)throw(err)

            db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'newcode.ejs',
                result:result,
                categ:results,
                book:'',
                list:'',
                cu:'u'
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
    })
        })
 },
 updatecode_process:(req,res)=>{
    var post=req.body
    console.log(post)
    var sntzedoldbigcon=sanitizeHtml(post.oldbig)
    var sntzedoldmincon=sanitizeHtml(post.oldmin)    
    var sntzedbigcon=sanitizeHtml(post.bigcon)
    var sntzedbigname=sanitizeHtml(post.bigname)
    var sntzedmincon=sanitizeHtml(post.mincon)
    var sntzedminname=sanitizeHtml(post.minname)

    db.query(`update code set bigcon=?,bigname=?,mincon=?,minname=? where bigcon=? and mincon=?`,
        [sntzedbigcon,sntzedbigname,sntzedmincon,sntzedminname,sntzedoldbigcon,sntzedoldmincon],(err,result)=>{
        if(err){
            console.log(err)
            res.send( `<script>alert("중복된 코드는 등록할 수 없습니다. 코드를 다시 확인해주세요. ")
            location.href="/admin/categ"
            </script>`)
        return;
        
        }
        res.redirect('/admin/categ')
    })

 },
 codedelete_process:(req,res)=>{
    var main=sanitizeHtml(req.query.main)
    var sub=sanitizeHtml(req.query.sub)
    console.log(main, sub)
    db.query(`delete from code where bigcon=? and mincon=?`,[main,sub],(err,result)=>{
        if(err){throw err}
        res.redirect("/admin/categ")
    })
 },
 book:(req,res)=>{
        var{loginid,login,name,cls}=authIsOwner(req,res)

        db.query( `select * from book join code on book.bigcon=code.bigcon and book.mincon=code.mincon order by book.h desc`,(error,results)=>{
            if(error){throw error}
            db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

            var context={
                who:name,
                login:login,
                cls:cls,
                body:'ADbook.ejs',
                result:result,
                categ:'',
                book:'',
                list:results,
                cu:''
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
 },
 bookdelete_process:(req,res)=>{
    bnum=sanitizeHtml(req.params.bnum)
    db.query(`delete from book where bnum=?`,[bnum],(err,result)=>{
        if(err){throw err}
        
         res.redirect('/admin/book')
    })
}
 
}