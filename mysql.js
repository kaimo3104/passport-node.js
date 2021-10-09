/*mysqlと連携しデータを格納し、取り出し、整合する*/
const express = require('express')
const mysql = require('mysql')
const bcrypt = require('bcrypt');

const app = express();
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
    console.log('sql   session success');
});


exports.storeLoginPass = function (user){
    //console.log(user);
    connection.query("INSERT INTO users SET ?",
    user,
    (err,results) => {
        if(err) {
        console.log('error connection' + err.stack);
        return connection.rollback(() => {
            throw err;
        });
        }else{
            console.log('store id name email hashpass');
        }
    return;
    });
}
/*exports.takeOutLogin = function (user){
    const sqlEmail = connection.query("SELECT * FROM users WEHRE email = ?",
    user.email,
    (err,results) => {
        if(err) {
        console.log('error connection' + err.stack);
        return connection.rollback(() => {
            throw err;
        });
        }else{
            console.log('take out  email hashpass');
        }
    return;
    });
    console.log(sqlEmail);
}*/

//module.exports = storeLoginpass;
