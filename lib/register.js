const { result, has } = require('lodash')
var db=require('./db')
var sanitizeHtml = require("sanitize-html")
const bcrypt = require("bcrypt");


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
    login:(req,res)=>{
            var {name,login,cls}=authIsOwner(req,res)
            var context={
                who:name,
                login:login,
                body:'login.ejs',
                cls:cls,
                result:'',
                categ:''
    
            }
            req.app.render('Frame',context,(err,html)=>{
                res.send(html)
            })
        },
 login_process:(req,res)=>{
    var post=req.body
    var sntzedLoginid=sanitizeHtml(post.loginid)
    var sntzedPassword=sanitizeHtml(post.password)

    db.query(`SELECT * FROM user WHERE loginid = ?`, [sntzedLoginid], async (error, results) => {
        if(error) throw error;

        if(results.length === 0){
            return res.send(`<script>alert("등록된 회원 정보가 없습니다."); location.href="/register/login"</script>`)
        }

        const user = results[0];

        // 입력한 평문 비밀번호와 DB 해시 비교
        const match = await bcrypt.compare(sntzedPassword, user.password);
        if(match){
            req.session.is_logined=true;
            req.session.loginid=user.loginid
            req.session.name=user.name
            req.session.cls=user.class
            req.session.save(()=>{res.redirect('/')})
        } else {
            req.session.is_logined=false
            req.session.name='Guest'
            req.session.cls='NON'
            req.session.save(()=>{
                res.send(`<script>alert("비밀번호가 틀렸습니다."); location.href="/register/login"</script>`)
            })
        }
    })
},

    logout_process:(req,res)=>{
        req.session.destroy((err)=>{
            res.redirect('/')
            });
    },
        
    register:(req,res)=>{
            if(req.session.is_logined==true){
                res.redirect('/')
            }
            else{
            var {name,login,cls}=authIsOwner(req,res)
            var context={
                who:name,
                login:false,
                body:'register.ejs',
                cls:cls,
                result:'',
                categ:''
    
            }
            req.app.render('Frame',context,(err,html)=>{
                if (err)
                    throw(err)
                res.send(html)
            })
        }
        },
    register_process:(req,res)=>{
            var post=req.body
           console.log(post)
            var image=post.image
            var sntzedLoginid = sanitizeHtml(post.loginid);
            var sntzedPassword = sanitizeHtml(post.password);
            var sntzedName = sanitizeHtml(post.name); 
            var sntzedAddress=sanitizeHtml(post.address)
            var sntzedtel=sanitizeHtml(post.tel)
            var sntzedbirth=sanitizeHtml(post.birth)
            var sntzedMf = sanitizeHtml(post.mf); 
            var sntzedclass=sanitizeHtml(post.class)

            
    bcrypt.hash(sntzedPassword, 10, (err, hash) => {   // 해싱
        if(err) throw err;
    
            
    
            db.query(`INSERT INTO user (loginid, password, name, mf, address, tel, birth, class) VALUES (?, ?, ?, ?, ?,?, ?, ?)`,
            [sntzedLoginid, hash, sntzedName,sntzedMf,sntzedAddress,sntzedtel,sntzedbirth,sntzedclass],(err,result)=>{
                    if(err){ return res.send(`<script>alert('아이디와 비번은 영문 15자 이내로 설정해주세요.'); location.href='/register/register';</script>`);}
                    
                    return res.redirect('/')
            })
                })
            },

profile:(req,res)=>{
     var {name,login,cls,loginid}=authIsOwner(req,res)
      db.query('SELECT * FROM user WHERE loginid = ?', [loginid], (err, results) => {
                    if (err) throw err;
             db.query( `select * from code`,(error,result)=>{
            if(error){throw error}     

            var context={
                who:name,
                login:login,
                body:'profile.ejs',
                cls:cls,
                result:results,
                categ:result
            }
            
        
            req.app.render('Frame',context,(err,html)=>{
              
                res.send(html)
            })
        })
      })
},
profile_process: (req,res)=>{
     var post=req.body
    
     const loginid = req.session.loginid;
            var sntzedName = sanitizeHtml(post.name); 
            var sntzedAddress=sanitizeHtml(post.address)
            var sntzedtel=sanitizeHtml(post.tel)
            var sntzedbirth=sanitizeHtml(post.birth)
          
    
            db.query(`UPDATE user set name=?, birth=?, tel=?, address=? where loginid=?`,
            [sntzedName, sntzedbirth, sntzedtel, sntzedAddress, loginid],(err,result)=>{
                    if(err){throw err}
                    
                    res.redirect('/register/profile')
                   
                })
            },

upload_process:(req,res)=>{
    if (!req.file) {
    return res.send(`<script>alert('파일을 먼저 선택해 주세요'); location.href='/register/profile';</script>`);
  }

    const fileName = req.file.filename;  // 파일명 추출
    const loginid = req.session.loginid;
    var file='/images/'+req.file.filename  

     db.query('UPDATE user SET image = ? WHERE loginid = ?', [fileName, loginid], (err, result) => {
        if (err) {
           return(err)
        }

    })

    res.send(`
  <!DOCTYPE html>
  <html lang="ko">
  <head>
    <meta charset="UTF-8">
    <title>이미지 미리보기</title>
    <link rel="stylesheet" href="/css/preview.css">
  </head>
  <body>
    <h1>이미지 미리보기</h1>
    <p><img id="preview" src="${file}" alt="프로필 이미지" width="120" height="120"></p>
    <a href="/register/profile">← 프로필로 돌아가기</a>
  </body>
  </html>
`);
},
delete_process:(req,res)=>{
    const fileName = 'user.png'  // 파일명 추출
    var {loginid, name,login,cls}=authIsOwner(req,res)

     db.query('update user SET image = ? WHERE loginid = ?', [fileName, loginid], (err, result) => {
        
        if(err){throw err}
            
    res.redirect('/register/profile')
    })

}, 
whoiam:(req,res)=>{
    var {loginid, name,login,cls}=authIsOwner(req,res)
          db.query('SELECT * FROM user', (err, results) => {
                    if (err) throw err;
            var context={
                who:name,
                login:login,
                body:'find.ejs',
                cls:cls,
                result:results,
                categ:''
            }
            
        
            req.app.render('Frame',context,(err,html)=>{
              
                res.send(html)
            })
        })
}, 
whoiam_process:(req,res)=>{
    var post=req.body
    var sntzedtel=sanitizeHtml(post.tel)
    db.query(`select count(*) as num from user where tel =? `,
                [sntzedtel],(error,results)=>{
                    if(results[0].num==1){
                         db.query(`select loginid from user where tel=?`,[sntzedtel],(err,result)=>{
                        if(err)throw err;
                        var loginid=result[0].loginid
                        res.send(`<script>alert("아이디는 ${loginid} 입니다.")
                            location.href="/register/login"
                            </script>`)

                         })
            
                    }
                    else{
                        res.send(`<script>alert("해당 정보로 가입된 아이디가 없습니다.")
                            location.href="/register/whoiam"
                            </script>`)
                     }
})
},
passwd:(req,res)=>{
      var {loginid, name,login,cls}=authIsOwner(req,res)
          db.query('SELECT * FROM user', (err, results) => {
                    if (err) throw err;
            var context={
                who:name,
                login:login,
                body:'findpasswd.ejs',
                cls:cls,
                result:results,
                categ:''
            }
            
        
            req.app.render('Frame',context,(err,html)=>{
              
                res.send(html)
            })
        })
},
passwd_process: (req, res) => {
  var post = req.body;
  var formType = post.formType;

  if (formType === 'confirm') {
    var sntzedloginid = sanitizeHtml(post.loginid);
    console.log("입력된 아이디:", req.body.loginid);
    db.query(`SELECT count(*) as num FROM user WHERE loginid = ?`, [sntzedloginid], (error, results) => {
      if (error) throw error;

      if (results[0].num == 1) {
        db.query(`SELECT * FROM user WHERE loginid = ?`, [sntzedloginid], (err, result) => {
          if (err) throw err;

          var name = result[0].name;
          // 로그인 아이디를 다음 요청에서도 사용할 수 있도록 세션에 저장
          req.session.pw_reset_loginid = sntzedloginid;

          res.send(`
            <script>
              alert("${name}님, 새로운 비밀번호를 설정해주세요.");
              location.href="/register/passwd";
            </script>
          `);
        });
      } else {
        res.send(`
          <script>
            alert("해당 아이디가 존재하지 않습니다.");
            location.href="/register/passwd";
          </script>
        `);
      }
    });
  }

  else if (formType === 'update') {
    var sntzedpasswd = sanitizeHtml(post.passwd);
    var sntzedrepasswd = sanitizeHtml(post.repasswd);

    if (sntzedpasswd !== sntzedrepasswd) {
      return res.send(`
        <script>
          alert("비밀번호가 서로 일치하지 않습니다.");
          location.href="/register/passwd";
        </script>
      `);
    }

    // 세션에서 로그인 아이디 가져오기
    var loginid = req.session.pw_reset_loginid;

    if (!loginid) {
      return res.send(`
        <script>
          alert("먼저 아이디 인증을 해주세요.");
          location.href="/register/passwd";
        </script>
      `);
    }

      bcrypt.hash(sntzedpasswd, 10, (err, hash)=>{
        if(err) throw err;
        db.query(`UPDATE user SET password = ? WHERE loginid = ?`, [hash, loginid], (err, result) => {
          if (err) throw err;
          delete req.session.pw_reset_loginid;
          res.send(`<script>alert("비밀번호가 성공적으로 변경되었습니다."); location.href="/register/login";</script>`);
        });
    })
}
}

}
