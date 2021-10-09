/*Web API ログイン処理　passportを用いた認証　新規登録とログイン認証*/

if(process.env.NODE_ENV !== 'production'){
  require('dotenv').config();
}

const mysql = require('mysql')
const connection = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password:'pepushi314',
    database:'login'
});
connection.connect((err) =>{
    if(err){
        console.log('error connection' + err.stack);
        return;
    }
    console.log('sql  main session success');
});
const express = require('express');
const ulid = require('ulid');
const app = express();
/*ハッシュ生成　関数定義*/
const bcrypt = require('bcrypt');
/*passportモジュールの使用*/
const passport = require('passport');
/*flashメッセージの設定を行う　今回は延期。追加項目*/ 
const flash = require('express-flash');
const session = require('express-session');
const methodOverride = require('method-override');
//mysqlファイルと連携
const sqlLogin = require('./mysql.js');

async function getUserByEmail (email){
  const data = await new Promise(
    (resolve, reject) => {
      connection.query("SELECT * FROM users WHERE email = ?",
      email,
      //emailからuserobjectを丸ごと取り出すには
      (err,results) => {
          if(err) {
            console.log('error connection' + err.stack);
            return connection.rollback(() => {
              throw err;
            });
          }else{
            
            console.log('take out  email hashpass');
          }
          resolve({
            error: err,
            results: results,
          });
        //console.log(results);
        //return ;
      });
      
  })
  return data;
}
const initializePassport = require('./passport-conf.js');
//パスポート
/*initializePassport(
  passport,
  //関数まるごと渡している。
  email => uuser.find((user) =>  user.email === email),
  id => uuser.find((user) => user.id === id)
);*/
let users;
let user =[];
let uuser = [];
initializePassport(passport,user[0]);





app.set('view-engine','ejs');

app.use(express.urlencoded({extended: false}));
app.use(flash());
/*セッションの設定*/
app.use(session(
  {
    secret:process.env.SESSION_SECRET,
    resave:false,
    saveUninitialized:false
  }
));

app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

app.get('/', checkAuthenticated,(req, res) => {
  res.render('index.ejs',{name:'Logined'});
});

/* login page　における処理*/
app.get('/login',checkNotAuthenticated,(req,res) => {
  res.render('login.ejs');
});
/*passport-localを用いたsession成功、失敗時のリダイレクト*/
app.post('/login',async(req,res) => {
  user = await getUserByEmail(req.body.email);
  user = user.results[0]
  //console.log(user);
  //initializePassport(passport,user);

  passport.authenticate('local',{
    successRedirect:'/',
    failureRedirect:'/login',
    failureFalsh:true
  });
  
  
})
/*登録ページにおける処理*/
app.get('/register',(req,res) =>{
  res.render('register.ejs');
});

/*ユーザー情報の追加*/ 
app.post('/register',async(req,res) => {
  try{
    const hashedPassword = await bcrypt.hash(req.body.password,10);
    users ={
      id:ulid.ulid(),
      username:req.body.name,
      email: req.body.email,
      password: hashedPassword
    };
    uuser.push(
      {
        id:ulid.ulid(),
      username:req.body.name,
      email: req.body.email,
      password: hashedPassword
      }
    )
    sqlLogin.storeLoginPass(users);
    res.redirect('/login');
  }catch{
    res.redirect('/register');
  };
  //loginで入れた情報とsqlに入れた情報で一致するのを取り出す。
  
})

/*ログアウトの処理、ログインページへ飛ぶように指定 */
app.delete('/logout',(req,res) => {
  req.logOut();
  res.redirect('/login');
});
/*ログインをしていない場合最初にアクセスするページを変更 */
function checkAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    return next();
  }
  res.redirect('/login');
}
/*すでにログイン認証がされている場合、アカウントページを表示し続けるよう設定 */
function checkNotAuthenticated(req,res,next){
  if(req.isAuthenticated()){
    res.redirect('/');
  }
  next()
}
app.listen(3000);
