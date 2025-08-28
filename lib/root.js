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
    
 home:(req,res)=>{
        var{loginid,login,name,cls}=authIsOwner(req,res)
        var sql1=`SELECT DISTINCT bigcon, bigname FROM code;`
        var sql2=`SELECT DISTINCT mincon, minname FROM code;`
 
        db.query( `select * from book order by h desc ;` ,(error,results)=>{
          
            if(error){throw error}
             db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}
           
             db.query( sql1,(error2,categ)=>{
                    if(error2){throw error2}
        
            var context={
                who:name,
                login:login,
                cls:cls,
                body:'test.ejs',
                result:result,
                categ:categ,
                book:results
            }
        res.render('Frame',context,(err,html)=>{
            if(err)console.log(err)
            res.send(html)
        })
        })
    })
})
 },
 search: (req, res) => {
    var { loginid, login, name, cls } = authIsOwner(req, res);
    var search = req.body.search;

    console.log('search:', search);

    // 보안: SQL injection 방지
    var keyword = `%${search}%`;

    db.query(`SELECT * FROM book WHERE bookname LIKE ? OR author LIKE order by h desc?`, [keyword, keyword], (error, books) => {
        if(error){throw error}
        if (books.length === 0) {
            return res.send(`
            <script>
            alert("검색 결과가 없습니다.");
            window.location.href = "/";
            </script>
            `);
        }

        db.query(`SELECT * FROM user WHERE loginid = ?`, [loginid], (error1, userResult) => {
            if (error1) {
                return res.send(`<script>alert("사용자 정보를 불러올 수 없습니다."); location.href="/login";</script>`);
            }

            var context = {
                who: name,
                login: login,
                cls: cls,
                body: 'test.ejs',
                result: userResult,
                categ: '',
                book: books
            };

            res.render('Frame', context, (err, html) => {
                if (err) {throw err}
                 res.send(html);
            });
        });
    });
},
view:(req,res)=>{
    var { loginid, login, name, cls } = authIsOwner(req, res);


     db.query( `select * from user where loginid=?;` ,[loginid],(error1,result)=>{
                    if(error1){throw error1}

    db.query(`select * from book where seller=? order by h desc`,[name],(err,books)=>{
        if(err){throw err}

         var context = {
                who: name,
                login: login,
                cls: cls,
                body: 'test.ejs',
                result: result,
                categ: '',
                book: books
            };

            res.render('Frame', context, (err, html) => {
                if (err) {throw err}
                 res.send(html);
            });
    })
})
}
}