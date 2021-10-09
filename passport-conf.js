
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
function initializePassport(passport,users){
    console.log(users);
    passport.use(new LocalStrategy ({
        usernameField:'email',
        passwordField:'password',
        },async(email,password,done) =>{
                //var reqEmail = req.body.email;
                //var reqPass = req.body.password;
                try{
                    if(email ==null){
                    return done(null,false);
                    }
                    else if(await bcrypt.compare(password,users.password)){
                        return done(null,users);
                    }else{
                        return done(null,false);
                    }
                }catch(e){
                        return done(e);}
        }

    ))
}
module.exports = initializePassport;