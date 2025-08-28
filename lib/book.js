const { result, isMatch } = require('lodash')
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
    
 detail:(req,res)=>{
        var{loginid,login,name,cls}=authIsOwner(req,res)
        console.log(req.params)
        bnum=req.params.bnum

        if(login==false){
           res.send(`<script>alert("로그인이 필요합니다.")
                            location.href="/register/login"
                            </script>`)
        }
        else{
    
        db.query( `SELECT b.*, u.loginid
            FROM book b
            JOIN user u ON b.seller = u.name
            WHERE b.bnum = ?`,[bnum],(error,results)=>{
            if(error){throw error}
            db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}
        console.log(result)
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'detail.ejs',
                result:result,
                categ:'',
                book:results
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
 }
},
create:(req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)
    var sql1=`SELECT DISTINCT bigcon, bigname FROM code;`
    var sql2=`SELECT DISTINCT mincon, minname FROM code;`
     if(login==false){
           res.send(`<script>alert("로그인이 필요합니다.")
                            location.href="/register/login"
                            </script>`)
        }
        else{
    db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}
        db.query(sql1+sql2,(err,results)=>{

        console.log(result)
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'create.ejs',
                result:result,
                categ:results[0],
                book:results[1]
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
    })
})
}
},
create_process:(req,res)=>{
     var{loginid,login,name,cls}=authIsOwner(req,res)
     var post=req.body
     console.log(post.seller)
     var image=req.file.filename
     var santzedseller=sanitizeHtml(post.seller)
     var santzedbookname=sanitizeHtml(post.bookname)
     var santzedauthor=sanitizeHtml(post.author)
     var santzedprice=sanitizeHtml(post.price)
     var santzedbigcon=sanitizeHtml(post.categ1)
     var santzedmincon=sanitizeHtml(post.categ2)
     var santzedcontent=sanitizeHtml(post.content)
    
     db.query(`INSERT INTO book(image, seller,bookname, author, price, bigcon, mincon,content, h) VALUES (?, ?, ?, ?,?, ?, ?,?,?)`,
        [image, santzedseller, santzedbookname,  santzedauthor, santzedprice, santzedbigcon, santzedmincon,
            santzedcontent, 0],(err,result)=>{
                if(err){throw err}


                res.redirect('/')
            }
            
     )
},
update:(req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)
    var sql1=`SELECT DISTINCT bigcon, bigname FROM code;`
    var sql2=`SELECT DISTINCT mincon, minname FROM code;`
    bnum=sanitizeHtml(req.params.bnum)

    db.query( `select * from book where bnum=?;` ,[bnum],(error1,result)=>{
                    if(error1){throw error1}

        db.query(sql1+sql2,(err,results)=>{
            if(err)throw err
            
              db.query( `select * from user where loginid=?;` ,[loginid],(error3,id)=>{
                    if(error3){throw error1}

        console.log(result)
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'update.ejs',
                result:id,
                categ:results,
                book:result
            }
            console.log(results)
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
    })
})
})

},
update_process: (req,res)=>{
    var{loginid,login,name,cls}=authIsOwner(req,res)
     var post=req.body
    
     console.log(post)
     console.log(req.body)
     var bnum=sanitizeHtml(post.bnum)

     var santzedseller=sanitizeHtml(post.seller)
     var santzedbookname=sanitizeHtml(post.bookname)
     var santzedauthor=sanitizeHtml(post.author)
     var santzedprice=sanitizeHtml(post.price)
     var santzedbigcon=sanitizeHtml(post.categ1)
     var santzedmincon=sanitizeHtml(post.categ2)
     var santzedcontent=sanitizeHtml(post.content)
    
    
    db.query(`update book set bookname=?, author=?, price=?, bigcon=?, mincon=? where bnum=?`,
        [santzedbookname,santzedauthor, santzedprice, santzedbigcon, santzedmincon, bnum],(err,result) => {
                if (err) throw err;
                res.redirect(`/book/detail/${bnum}`);
    })
},
delete_process:(req,res)=>{
    bnum=sanitizeHtml(req.params.bnum)
    db.query(`delete from book where bnum=?`,[bnum],(err,result)=>{
        if(err){throw err}
        
         res.redirect('/')
    })
},
like:(req,res)=>{
    var { loginid, login, name, cls } = authIsOwner(req, res);
    var post=req.body
    var bnum=sanitizeHtml(req.params.bnum)
    var newh=(post.h)
    console.log(post.h)

    db.query(`update book set h=? where bnum=?`,[newh,bnum],(err,result)=>{
        if(err){throw err}
        
         res.redirect(`/book/detail/${bnum}`)
}
)
}
}