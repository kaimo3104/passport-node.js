/*passport-localを用いて認証時の処理を行う*/
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
/*app.jsから渡されたuser情報、passportモジュを用いて認証時の処理を行う　*/
function initialize(passport,users) {
    const authenticateUser = async(req,user,done) => {
        let reqPass = req.body.password;
        console.log(req.body.password);
        try{
            console.log(888888888888)
            if(await bcrypt.compare(reqPass,users.password)){
                return done(null,user);
            }else{
                return done(null,false,{message:'passwordが正しく入力されていません'});
            }
        }catch(e){
            return done(e);

        };
    };
    passport.use(new LocalStrategy({usernameField:'email',passwordField:'password'},authenticateUser));
    //シリアル化 passportのストラテジーに関する設定
    /*passport.serializeUser((user,done) => {
        done(null,user.id);
    });
    passport.deserializeUser((id,done) => {
        done(null,getUserById(id));
    });*/
    }
/*モジュール化*/
module.exports = initialize;